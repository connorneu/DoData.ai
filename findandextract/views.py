from fileinput import filename
from sqlite3 import DatabaseError
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
import pandas as pd
from django.core.files.storage import FileSystemStorage
from .models import KeyValueDataFrame
from .models import KeyValueDataFrame_Result
import os
from django.http import JsonResponse
import json
from django.shortcuts import redirect
from django.urls import reverse
import math
from .forms import DataFilters 
import json
import sys
import time
from pandas.api.types import CategoricalDtype
import numpy as np
import json
from .languagemodel import *
import threading
import os
import ast
import collections
from functools import reduce
import traceback

goog_w2v_model = None
nlp = None
threads = []
nli = None
# Create your views here.

def Load_Language_Model():
    global goog_w2v_model
    global nlp
    global threads 
    print('loading model')
    #piBuild_Quick_Gensim_Model()
    goog_w2v_model, nlp = Load_Models()
    # Build_Quick_Gensim_Model() needs to be called first time on .bin Google Word vectors to create quick version in directory (cannot copy paste)
    print('model loaded')

def Get_LNI_Model():
    global nli
    nli = Load_NLI_Model()

def findandextract(request):
    global nli
    global threads
    if request.method == 'POST':
        print("POST REQUEST MADE")
        if is_ajax(request): 
            print('AJAX POST REQUEST')
            #try:
            if request.POST.get('ajax_name') == 'submit_extract_parameters':
                print("START OF AJAX POST submit_extract_parameters")
                print(request.POST)
                params = json.loads(request.POST.get('parameters'))

                input_or_description = params['input_or_description'].rstrip().strip()
                extract_file_name = params['extractfilename'].rstrip().strip()
                extract_col_name = params['extractcolname'].rstrip().strip()
                describe_values_raw = ast.literal_eval(params['describevalues'])
                describe_values = clean_describe_values(describe_values_raw)
                print(describe_values)
                find_file_1 = params['findfile1'].rstrip().strip()
                find_col_1 = params['findcol1'].rstrip().strip()
                find_file_2 = params['findfile2'].rstrip().strip()
                find_col_2 = params['findcol2'].rstrip().strip()
                find_file_3 = params['findfile3'].rstrip().strip()
                find_col_3 = params['findcol3'].rstrip().strip()
                find_file_4 = params['findfile4'].rstrip().strip()
                find_col_4 = params['findcol4'].rstrip().strip()
                search_where = [[find_file_1, find_col_1], [find_file_2, find_col_2], [find_file_3, find_col_3], [find_file_4, find_col_4]]
                print('inpui', input_or_description)
                print('extrrafile', extract_file_name)
                print('extracol', extract_col_name)
                print('desc', describe_values)
                print('esc1', describe_values[0])
                print('esc00', describe_values[0][0])
                print('file1', find_file_1)
                print('file2', find_file_2)
                print('file3', find_file_3)
                print('file4', find_file_4)
                print('col1', find_col_1)
                print('col2', find_col_2)
                print('col3', find_col_3)
                print('col4', find_col_4)
                df_result = Extract(input_or_description, extract_file_name, extract_col_name, describe_values, search_where)
                print('------------- RESULT --------------')
                print(df_result)
                df_list = melt_df(df_result)
                print("saving result to db...")
                db_obj_list = []
                for dbframe in df_list:
                    db_obj_list.append(KeyValueDataFrame_Result(key=dbframe[0], val=dbframe[1]))
                KeyValueDataFrame_Result.objects.bulk_create(db_obj_list)
                print('saved results')

                #print("saving to db...")
                #db_obj_list = []
                #for dbframe in df_list:
                #    #obj = KeyValueDataFrame.objects.create(file_name=dbframe[0], sheet_name=dbframe[1], key=dbframe[2], val=dbframe[3]) 
                #    db_obj_list.append(KeyValueDataFrame(file_name=dbframe[0], sheet_name=dbframe[1], key=dbframe[2], val=dbframe[3]))
                #KeyValueDataFrame.objects.bulk_create(db_obj_list)
                #print('saved')
                #db_data = list(KeyValueDataFrame.objects.values())


                return HttpResponse(status=200)

                #except Exception as e:
                #    exc_type, exc_obj, exc_tb = sys.exc_info()
                #    fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
                #    print(exc_type, fname, exc_tb.tb_lineno)
                #    print(e)
                #    return HttpResponse(status=400)
            elif request.POST.get('ajax_name') == 'filter_data':
                warnings = "No warnings"
                print(request.POST)
                conds = json.loads(request.POST.get('conds'))
                print('conds')
                print(conds)
                header_row = int(request.POST.get('header_row'))
                print('header row:', header_row)
                table_name = request.POST.get('table_name')
                print('table num:', table_name)
                sheet_name = request.POST.get('sheet_name')
                print('sheet name:', sheet_name)
                df = unmelt(table_name, sheet_name)
                df_og = df.copy(deep=True)
                if header_row > 0:
                    df = change_header(df, header_row)
                if conds[0][1] != 'Select Column':
                    df = apply_conditions(df, conds) 
                    print('apply conditions')
                    if df.equals(df_og) or df.empty:                
                        warnings = "Conditions did not return any mathching rows. No conditions applied to dataset."
                        print('WARNING:', warnings) 
                        df = df_og
                if header_row > 0 or conds[0][1] != 'Select Column':
                    print('deleting old records')
                    objs_del = KeyValueDataFrame.objects.filter(file_name=table_name, sheet_name=sheet_name)
                    objs_del.delete()
                    df_list = melt_filtered_df(df, table_name, sheet_name)
                    print('saving to db...')
                    db_obj_list = []
                    for dbframe in df_list:                    
                        db_obj_list.append(KeyValueDataFrame(file_name=dbframe[0], sheet_name=dbframe[1], key=dbframe[2], val=dbframe[3]))
                    KeyValueDataFrame.objects.bulk_create(db_obj_list)
                    print('saved')            
                    fande_db_data = list(KeyValueDataFrame.objects.values())
                    return JsonResponse({'fande_data_dump' : fande_db_data, 'warnings' : warnings})
                else:     
                    print('returning 200 - headerrow > 0 and no conds')  
                    fande_db_data = list(KeyValueDataFrame.objects.values()) 
                    print('warnings', warnings)
                    print('dmbp')
                    #print(fande_db_data)    
                    return JsonResponse({'fande_data_dump' : fande_db_data, 'warnings' : warnings})


            elif request.POST.get('ajax_name') == 'combine_merge':
                print("START OF AJAX POST combine_merge")
                print(request.POST)
                myjoins = request.POST.get('parameters')
                myjoins = json.loads(myjoins)
                join1 = myjoins[0]
                df_result = Combine_Merge(join1)
                print('------------- RESULT --------------')
                print(df_result)
                df_list = melt_df(df_result)
                print("saving result to db...")
                for dbframe in df_list:
                    obj = KeyValueDataFrame_Result.objects.create(key=dbframe[0], val=dbframe[1])
                return HttpResponse(status=200)
            elif request.POST.get('ajax_name') == 'update_file':
                print("START OF AJAX POST update file")
                print(request.POST)
                update_params = json.loads(request.POST.get('parameters'))
                update_file_params = update_params['update_file_params']
                files_to_update_params = update_params['files_to_update']
                df_results = Update_From_File(update_file_params, files_to_update_params)
                print('----------------RESULT---------------')
                print(df_results)
                for df_result in df_results:
                    df_list = melt_df(df_result)
                    print("saving result to db...")
                    for dbframe in df_list:
                        obj = KeyValueDataFrame_Result.objects.create(key=dbframe[0], val=dbframe[1])
                return HttpResponse(status=200)
            elif request.POST.get('ajax_name') == 'reconcile':
                print("START OF AJAX POST reconcile")
                print(request.POST)
                parameters = request.POST.get('parameters')
                parameters = json.loads(parameters)
                first_file = parameters['first_file']
                first_sheet = parameters['first_sheet']
                second_file = parameters['second_file']
                second_sheet = parameters['second_sheet']
                cols_to_match = parameters['cols_to_match']
                cols_to_compare = parameters['cols_to_compare']
                df_result = Reconcile_Files(first_file, first_sheet, second_file, second_sheet, cols_to_match, cols_to_compare)
                print('------------- RESULT --------------')
                print(df_result)
                df_list = melt_df(df_result)
                print("saving result to db...")
                for dbframe in df_list:
                    obj = KeyValueDataFrame_Result.objects.create(key=dbframe[0], val=dbframe[1])
                return HttpResponse(status=200)
            elif request.POST.get('ajax_name') == 'calculate':
                print('START OF AJAX POST calculate')
                print(request.POST)
                parameters = request.POST.get('parameters')
                parameters = ast.literal_eval(parameters)
                print(parameters)
                print(type(parameters))
                filename = parameters['filename']
                groups = parameters['groups']
                actions = parameters['actions']
                print('filename', filename)
                print('groups', groups, groups[0])
                print('acions', actions, actions[0])
                df_result = calculate_metrics(filename, groups, actions)
                print('-----------------RESULT------------')
                print(df_result)
                df_list = melt_df(df_result)
                print("saving result to db...")
                for dbframe in df_list:
                    obj = KeyValueDataFrame_Result.objects.create(key=dbframe[0], val=dbframe[1])
                return HttpResponse(status=200)

            elif request.POST.get('ajax_name') == 'classify_text':
                print('POST: classify_text')
                user_desc = request.POST.get('user_algo_desc')
                algo_type, algo_desc = classify_zeroshot(nli, user_desc)
                print('algo_type', algo_type)
                print('algo desc', algo_desc)
                return JsonResponse({'algo_type': algo_type, 'algo_desc': algo_desc})
                #return JsonResponse({'algo_type': 'failure'})
            elif request.method == 'POST': 
                try:
                    file = request.FILES['file']
                    print('AJAX file pos')
                    print(request.POST)
                    myfile = request.FILES['file']  
                    print(myfile)
                    sheets = get_sheet_names(myfile)
                    print('sheets:', sheets)
                    return JsonResponse({'sheets' : sheets})
                except:
                    print('DATA UPLOAD POS')
                    print(request.POST)
                    upload_data_files(request)
                    #return HttpResponse(status=200)
                    fande_db_data = list(KeyValueDataFrame.objects.values())
                    return JsonResponse({'fande_data_dump' : fande_db_data})

        else:
            #if 'fileinput1' in request.POST or 'fileinput2' in request.POST:
            #if request.FILES['fileinput1'] or request.FILES['fileinput2']:
            #    print('redirecting to upload.')
            #    upload_data_files(request)
            #    print("shit")
            #    fande_db_data = list(KeyValueDataFrame.objects.values())
            #    return HttpResponse(status=200)
            print("AJAXFAILURE")
            return HttpResponse(status=400)    
    else:
        print("GET REQUEST")
        if is_ajax(request):
            if request.GET.get('ajaxid') == 'result_db': # ajaxid:'result_db'
                result_table_db = list(KeyValueDataFrame_Result.objects.values())
                return JsonResponse({'result_table' : result_table_db})
            else:
                print("AJAX GET REQUEST")
                fande_db_data = list(KeyValueDataFrame.objects.values())
                return JsonResponse({'fande_data_dump' : fande_db_data})
        else:
            x = threading.Thread(target=Get_LNI_Model) # target=Load_Language_Model
            x.start()
            threads.append(x)
            return render(request, "findandextract/fandemain.html")
        #return render(request, "findandextract/fandemain.html", {'fande_data_dump' : fande_db_data})

def clean_describe_values(describe_values_raw):
    describe_values = []
    for row in describe_values_raw:
        row_items = []
        for elem in row:
            print('elem', elem)
            newelem = elem.rstrip().strip()
            print('newelem', newelem)
            row_items.append(newelem)
        describe_values.append(row_items)
    return describe_values

def upload_data_files(request):
    print("UPLOADING FILES")
    print(request.FILES)
    print(request)
    if request.method == 'POST' and request.FILES['file_1']:
        print("Importing file 1...")
        print(request.FILES)
        myfile = request.FILES['file_1']  
        sheetname = request.POST['file_1_sheet']
        print('melting df')
        print('mefile', myfile)
        df_columns, df_list = build_df_melt(myfile, sheetname)
        print("saving to db...")
        db_obj_list = []
        for dbframe in df_list:
            #obj = KeyValueDataFrame.objects.create(file_name=dbframe[0], sheet_name=dbframe[1], key=dbframe[2], val=dbframe[3]) 
            db_obj_list.append(KeyValueDataFrame(file_name=dbframe[0], sheet_name=dbframe[1], key=dbframe[2], val=dbframe[3]))
        KeyValueDataFrame.objects.bulk_create(db_obj_list)
        print('saved')
        db_data = list(KeyValueDataFrame.objects.values())
        #return redirect("findandextract")
    if 'file_2' in request.FILES:
        if request.method == 'POST' and request.FILES['file_2']:    
            print('Importing file 2...')
            myfile2 = request.FILES['file_2']     
            sheetname = request.POST['file_2_sheet']
            #file_names.append(myfile2)
            print('melting df')
            df2_columns, df2_list = build_df_melt(myfile2, sheetname)
            print('saving to db...')
            db_obj_list = []
            for dbframe in df2_list:
                #obj = KeyValueDataFrame.objects.create(file_name=dbframe[0], sheet_name=dbframe[1], key=dbframe[2], val=dbframe[3]) 
                db_obj_list.append(KeyValueDataFrame(file_name=dbframe[0], sheet_name=dbframe[1], key=dbframe[2], val=dbframe[3]))
            KeyValueDataFrame.objects.bulk_create(db_obj_list)
            print('saved')            
            db_data = list(KeyValueDataFrame.objects.values())
    if 'file_3' in request.FILES:
        if request.method == 'POST' and request.FILES['file_3']:    
            print('Importing file 3...')
            myfile3 = request.FILES['file_3']  
            sheetname = request.POST['file_3_sheet']   
            #file_names.append(myfile2)
            print('melting df')
            df3_columns, df3_list = build_df_melt(myfile3, sheetname)
            print('saving to db...')
            db_obj_list = []
            for dbframe in df3_list:
                #obj = KeyValueDataFrame.objects.create(file_name=dbframe[0], sheet_name=dbframe[1], key=dbframe[2], val=dbframe[3]) 
                db_obj_list.append(KeyValueDataFrame(file_name=dbframe[0], sheet_name=dbframe[1], key=dbframe[2], val=dbframe[3]))
            KeyValueDataFrame.objects.bulk_create(db_obj_list)
            print('saved')            
            db_data = list(KeyValueDataFrame.objects.values())
    if 'file_4' in request.FILES:
        if request.method == 'POST' and request.FILES['file_4']:    
            print('Importing file 4...')
            myfile4 = request.FILES['file_4']  
            sheetname = request.POST['file_4_sheet']  
            #file_names.append(myfile2)
            print('melting df')
            df4_columns, df4_list = build_df_melt(myfile4, sheetname)
            print('saving to db...')
            db_obj_list = []
            for dbframe in df4_list:
                #obj = KeyValueDataFrame.objects.create(file_name=dbframe[0], sheet_name=dbframe[1], key=dbframe[2], val=dbframe[3]) 
                db_obj_list.append(KeyValueDataFrame(file_name=dbframe[0], sheet_name=dbframe[1], key=dbframe[2], val=dbframe[3]))
            KeyValueDataFrame.objects.bulk_create(db_obj_list)
            print('saved')            
            db_data = list(KeyValueDataFrame.objects.values())
            #return redirect("findandextract")

#IT'S POSSIBLE YOU CAN DELETE THIS
def findandextract_data_upload(request):
    file_names = []
    if request.method == 'POST':
        #if request.method == 'POST' and request.FILES['myfile1']:
        if request.method == 'POST' and 'fileinput1' in request.POST:
            print("Importing file 1...")
            myfile = request.FILES['myfile1']  
            file_names.append(myfile)
            print('melting df')
            df_columns, df_list = build_df_melt(myfile)
            print("saving to db...")
            for dbframe in df_list:
                obj = KeyValueDataFrame.objects.create(file_name=dbframe[0], sheet_name=dbframe[1], key=dbframe[2], val=dbframe[3])           
                #obj.save()
            db_data = list(KeyValueDataFrame.objects.values())
            return redirect("findandextract")
        if request.method == 'POST' and request.FILES['fileinput2']:    
            print('Importing file 2...')
            myfile2 = request.FILES['myfile2']     
            file_names.append(myfile2)
            print('melting df')
            df2_columns, df2_list = build_df_melt(myfile2)
            print('saving to db...')
            for dbframe in df2_list:
                obj = KeyValueDataFrame.objects.create(file_name=dbframe[0], sheet_name=dbframe[1], key=dbframe[2], val=dbframe[3])           
                #obj.save()
            db_data = list(KeyValueDataFrame.objects.values())
            return redirect("findandextract")
        
    fande_db_data = list(KeyValueDataFrame.objects.values())
    return render(request, "findandextract/fandeload.html", {'fande_data_dump' : fande_db_data})

def melt_filtered_df(df, filename, sheetname):
    df['sheet'] = sheetname
    df_keyvalue = df.melt(id_vars = ['sheet'])
    df_keyvalue['file_name'] = str(filename)
    if 'variable' in df_keyvalue.columns:
        df_keyvalue.rename(columns={'variable':'key'}, inplace=True)
    df_list = list(df_keyvalue[['file_name', 'sheet', 'key', 'value']].values)
    return df_list


def get_sheet_names(myfile):
    file_ext = str(myfile).split('.')[-1]
    if file_ext[0] == 'x':
        xl = pd.ExcelFile(myfile)
        print('sheetnames', xl.sheet_names)
        return xl.sheet_names
    else:
        return 'Sheet1'


# for raw input
def build_df_melt(myfile, sheetname):
    df_sheets = []
    file_ext = str(myfile).split('.')[-1]
    if file_ext[0] == 'x':
        df = pd.read_excel(myfile, sheet_name=sheetname, engine='openpyxl')
        #for name, sheet in df.items():
        #    sheet['sheet'] = name
        #    sheet = sheet.rename(columns=lambda x: x.split('\n')[-1])
        #    df_sheets.append(sheet)
        #df = pd.concat(df_sheets)
        #df.reset_index(inplace=True, drop=True)
        df['sheet'] = sheetname
    else:
        df = pd.read_csv(myfile)
        df['sheet'] = 'Sheet1'
    df_columns = list(df.columns)
    df_keyvalue = df.melt(id_vars = ['sheet'])
    print('dropping unrelated datapoints...')
    df_keyvalue = drop_columns_from_unrelated_sheets(df_keyvalue)
    df_keyvalue['file_name'] = str(myfile)
    df_list = list(df_keyvalue[['file_name', 'sheet', 'variable', 'value']].values)
    return df_columns, df_list

# for dataframe input
def melt_df(df):
    df_k_v = df.melt()
    df_list = list(df_k_v[['key', 'value']].values)  #list(df_k_v[['key', 'value']].values)
    return df_list

# if value for each columni n a sheet is NaN then drop after melt as it was appended to sheet name incorrectly
def drop_columns_from_unrelated_sheets(df):
    sheet_and_header_pairs = df[['sheet', 'variable']].values.tolist()
    sheet_and_header_pairs = [list(x) for x in set(tuple(x) for x in sheet_and_header_pairs)]
    dropped_cols = []
    for pair in sheet_and_header_pairs:
        if pair[1] not in dropped_cols:
            df_values = df.loc[(df['sheet'] == pair[0]) & (df['variable'] == pair[1])]
            if df_values['value'].isnull().all():
                df = df.drop(df[((df['sheet'] == pair[0]) & (df['variable'] == pair[1]))].index)
                dropped_cols.append(pair[1])                                                                                                                                                                                
    return df

def is_ajax(request):
  return request.headers.get('x-requested-with') == 'XMLHttpRequest'

# unmelt user data with file names
def unmelt(file_name, sheet_name):
    db_data = list(KeyValueDataFrame.objects.values())
    key_val = []
    for row in db_data:
        if row['file_name'] == file_name and row['sheet_name'] == sheet_name:
            key = row['key']
            val = row['val']
            key_val.append((key, val))
    df_melt = pd.DataFrame(key_val, columns=['key', 'val'])    
    df = df_melt.assign(idx=df_melt.groupby('key').cumcount())
    # convert column values to categories to prevent pandas from sorting alphabetically
    col_cats = f7(df['key'].values.tolist())
    cat_type = CategoricalDtype(categories=col_cats, ordered=True)
    df['key'] = df['key'].astype(cat_type)
    df = df.pivot(index='idx', columns='key', values='val')
    return df

# unmelt result data
def unmelt_result_df(result_db_data):
    key_val = []
    for row in result_db_data:
        key = row['key']
        val = row['val']
        key_val.append((key, val))
    df_melt = pd.DataFrame(key_val, columns=['key', 'val'])    
    df = df_melt.assign(idx=df_melt.groupby('key').cumcount())
    # convert column values to categories to prevent pandas from sorting alphabetically
    col_cats = f7(df['key'].values.tolist())
    cat_type = CategoricalDtype(categories=col_cats, ordered=True)
    df['key'] = df['key'].astype(cat_type)
    df = df.pivot(index='idx', columns='key', values='val')
    #df = df.to_json()
    df = df.values.tolist()
    return df

def change_header(df, header_row):
    print('REchange')
    print(list(df.columns.values))
    print(df.index.name)
    print(df)
    df.columns = df.iloc[header_row-1]    
    df = df.iloc[pd.RangeIndex(len(df)).drop(header_row-1)]
    print('?df', isinstance(df,pd.DataFrame))
    print('?s', isinstance(df,pd.Series))
    #df = df.reset_index(drop=True)
    df = df.reset_index(drop=True)
    column_names = list(df.columns.values)
    df.columns = column_names
    print('new df')
    print(list(df.columns.values))
    print(df.index.name)
    print(df)

    #df = df.reset_index(drop=True)
    return df

def f7(seq):
    seen = set()
    seen_add = seen.add
    return [x for x in seq if not (x in seen or seen_add(x))]

def apply_conditions(df, conditions):
    print(df)
    print(conditions)
    #conditions are collected inversedly - so reverse them

    df_new = df.copy()
    #conditions_reversed = json.loads(conditions)
    conditions_reversed = conditions
    conditions = []
    try:
        for condition in reversed(conditions_reversed):
            conditions.append(condition)

        for condition in conditions:
            if condition[3].isnumeric():
                print("NUMNERCI CONDITION", condition[3])
                df[condition[1]] = df[condition[1]].astype(np.float64)
                condition[3] = float(condition[3])
                if condition[4] != '':
                    condition[4] = float(condition[4])   
            else:
                condition[3] = condition[3]
        condition_arr = []
        for i in range(0, len(conditions)):
            condition = conditions[i]
            if condition[2] == 'Equals':   
                condition_str = df[condition[1] == str(condition[3])]
            if condition[2] == 'Contains':
                condition_str = df[condition[1]].str.contains(str(condition[3]))            
            if condition[2] == 'Between':
                condition_str = (df[condition[1]] > str(condition[3])) & (df[condition[1]] < str(condition[4]))
            if condition[2] == 'Greater Than':
                condition_str = df[condition[1]] > str(condition[3])
            if condition[2] == 'Less Than':
                condition_str = df[condition[1]] < str(condition[3])
            if condition[2] == 'Not Equal To':
                condition_str = df[condition[1]] != str(condition[3])
            if condition[2] == 'Does Not Contain':
                condition_str = ~df[condition[1]].str.contains(str(condition[3]))
            if condition[2] == 'Starts With':
                condition_str = df[condition[1]].str.startswith(str(condition[3]))
            if condition[2] == 'Ends With':
                condition_str = df[condition[1]].str.endswith(str(condition[3]))
            condition_arr.append(condition_str)
        df_new = df.loc[np.logical_and.reduce(condition_arr)]
        return df_new
    except Exception:
        print("ERROR: CONDITIONS")
        traceback.print_exc()
        return df                    

def Extract(input_or_description, extract_file_name, extract_col_name, describe_values, search_where):
    #Extract(dfs, values_to_extract_dataset, values_to_extract_col, extract_from):
    df_result = None
    if input_or_description == 'input':
        file, sheet = parse_file_name_from_bracket_display(extract_file_name)
        df = unmelt(file, sheet)
        df_extract_values = df[extract_col_name].values.tolist()
    else:
        df_extract_values = describe_values
    
    dfs = {}
    for dataset_name, col in search_where:
        print(dataset_name, '|', col)
        file, sheet = parse_file_name_from_bracket_display(dataset_name)
        df = unmelt(file, sheet)
        dfs[dataset_name] = df
        common_col_name = search_where[0][1]
    for dataset_name, col in search_where:
        df_single_result = Search_Column_Values(dfs[dataset_name], col, df_extract_values)
        df_single_result = df_single_result.rename(columns={col: common_col_name})
        if not df_single_result.empty:
            df_single_result.columns=df_single_result.columns.astype('str')
            df_single_result['Dataset'] = dataset_name
            print()
            print('df single result')
            print(df_single_result)
            print()
            if not isinstance(df_result, pd.DataFrame):
                df_result = df_single_result
            else:
                df_result = pd.concat([df_result, df_single_result], ignore_index=True)
            print("?!")
            print(df_result)
                #df_result = df_result.reset_index(drop=True)
                
    #df_result = Reorder_Columns(df_result, matched_col_header, all_df_col_headers)
    return df_result

def Collect_All_Col_Headers(dfs, search_where):
    all_df_col_headers = []
    for dataset_name, df in dfs.items():
        for col in df.columns.tolist():
            all_df_col_headers.append(col)
    print('all df col headers')
    print(all_df_col_headers)
    return all_df_col_headers

    #for dataset, col in search_where:
    #    wb_ws = df_col[0] + ' ' + df_col[1]
    #    for col in dfs[wb_ws].columns.tolist():
    #        all_df_col_headers.append(col)
    #return all_df_col_headers

def Add_Filename_ColHeader(df, wb_ws, matched_col_header, cols_in_multiple_dfs):
    for col_i in range(len(df.columns)):
        curr_header = df.columns[col_i]
        if curr_header != matched_col_header and curr_header not in cols_in_multiple_dfs:
            new_header = curr_header + '_' + wb_ws
            df = df.rename(columns={curr_header: new_header})
    return df

def Reorder_Columns(df, matched_col_header, all_df_col_headers):
    col_headers = df.columns.tolist()
    duplicates = [item for item, count in collections.Counter(all_df_col_headers).items() if count > 1]
    unique_col_headers = f7(col_headers)
    for duplicate in duplicates:
        unique_col_headers.remove(duplicate)
    unique_col_headers.remove('Dataset')
    ordered_col_headers = ['Dataset'] + [matched_col_header] + duplicates + unique_col_headers
    df = df[ordered_col_headers]
    print(ordered_col_headers)
    return df


def Search_Column_Values(df, col, df_extract_values):
    df_result = df[df[col].isin(df_extract_values)]
    return df_result
    
def Combine_Merge(join_params):
    df1 = unmelt(join_params[1], join_params[2])
    df2 = unmelt(join_params[4], join_params[5])
    df_result = pd.merge(df1, df2, left_on=join_params[3], right_on=join_params[6], how='inner')
    return df_result

def Update_From_File(update_file_params, files_to_update_params):
    df_update_file = unmelt(update_file_params[0], update_file_params[1])
    dfs_to_update = Unmelt_Files_To_Update(files_to_update_params)  
    for idx in range(len(dfs_to_update)):
        df = dfs_to_update[idx]
        for index, row in df_update_file.iterrows():
            for val_to_update in update_file_params[3]:
                if len(update_file_params[2]) == 1:
                    df.loc[df[files_to_update_params[idx][2][0]] == row[update_file_params[2]].values.tolist()[0],
                            files_to_update_params[idx][3]] = row[val_to_update]
                elif len(update_file_params[2]) == 2:
                    df.loc[(df[files_to_update_params[idx][2][0]] == row[update_file_params[2]].values.tolist()[0])
                           & (df[files_to_update_params[idx][2][1]] == row[update_file_params[2]].values.tolist()[1]),
                        files_to_update_params[idx][3]] = row[val_to_update]
                elif len(update_file_params[2]) == 3:
                    df.loc[(df[files_to_update_params[idx][2][0]] == row[update_file_params[2]].values.tolist()[0])
                           & (df[files_to_update_params[idx][2][1]] == row[update_file_params[2]].values.tolist()[1])
                           & (df[files_to_update_params[idx][2][2]] == row[update_file_params[2]].values.tolist()[2]),
                        files_to_update_params[idx][3]] = row[val_to_update]
                elif len(update_file_params[2]) == 4:
                    df.loc[(df[files_to_update_params[idx][2][0]] == row[update_file_params[2]].values.tolist()[0])
                           & (df[files_to_update_params[idx][2][1]] == row[update_file_params[2]].values.tolist()[1])
                           & (df[files_to_update_params[idx][2][2]] == row[update_file_params[2]].values.tolist()[2])
                           & (df[files_to_update_params[idx][2][3]] == row[update_file_params[2]].values.tolist()[3]),
                        files_to_update_params[idx][3]] = row[val_to_update]
    return dfs_to_update    


def Unmelt_Files_To_Update(files_to_update_params):
    dfs_to_update = []
    df1 = unmelt(files_to_update_params[0][0], files_to_update_params[0][1])
    dfs_to_update.append(df1)
    if len(files_to_update_params) > 1:
        df2 = unmelt(files_to_update_params[1][0], files_to_update_params[1][1])
        dfs_to_update.append(df2)
    if len(files_to_update_params) > 2:
        df3 = unmelt(files_to_update_params[2][0], files_to_update_params[2][1])
        dfs_to_update.append(df3)
    if len(files_to_update_params) > 3:
        df4 = unmelt(files_to_update_params[3][0], files_to_update_params[4][0])
        dfs_to_update.append(df4)
    return dfs_to_update

def Reconcile_Files(first_file, first_sheet, second_file, second_sheet, match_cols, compare_cols):
    df1 = unmelt(first_file, first_sheet)
    df2 = unmelt(second_file, second_sheet)
    first_file_name = first_file.replace('.csv', '')
    second_file_name = second_file.replace('.csv', '')
    df1 = df1.add_suffix(' {' + first_file_name + '}')
    df2 = df2.add_suffix(' {' + second_file_name + '}')
    leftmatch, rightmatch = Split_Left_Right_Match_Cols(match_cols, first_file_name, second_file_name)
    leftcompare, rightcompare = Split_Left_Right_Match_Cols(compare_cols, first_file_name, second_file_name)
    left_cols = leftmatch + leftcompare
    right_cols = rightmatch + rightcompare
    df1_trim = df1[df1.columns.intersection(left_cols)]
    df2_trim = df2[df2.columns.intersection(right_cols)]
    df1_trim.drop_duplicates(inplace=True)
    df2_trim.drop_duplicates(inplace=True)
    df_merge = pd.merge(df1_trim, df2_trim, how='inner', left_on=leftmatch, right_on=rightmatch)
    match_values = Unique_Column_Pairs(df_merge[leftmatch].values.tolist())
    for match_value in match_values:
        conds = []
        for i_val in range(len(match_value)):
            conds.append(df_merge[leftmatch[i_val]] == match_value[i_val])
        df_matched = df_merge.loc[np.logical_and.reduce(conds)]
        for i_comp in range(len(compare_cols)):
            right_compare_vals = df_matched[rightcompare[i_comp]].values.tolist()
            left_compare_vals = df_matched[leftcompare[i_comp]].values.tolist()
            val_variants = []
            for right_val in right_compare_vals:
                if right_val not in left_compare_vals:
                    val_variants.append(right_val)
            if val_variants:
                conds_df1_match = []
                for i_val in range(len(match_value)):
                    conds_df1_match.append(df1[leftmatch[i_val]] == match_value[i_val])
                conds_df1_match.append(df1[leftcompare[i_comp]] == left_compare_vals[i_comp])
                print('rightcomapre')
                print(rightcompare[i_comp])
                print('filname')
                print(second_file_name)
                
                comparison_column_name = 'Comparison: ' + rightcompare[i_comp]
                print('COMPARISON NAME')
                print(comparison_column_name)
                df1.loc[np.logical_and.reduce(conds_df1_match), comparison_column_name] = 'Other Values: ' + str(val_variants)  
                df1.loc[df1[comparison_column_name] == 'nan', comparison_column_name] = 'EXACT MATCH'
                df1.loc[df1[comparison_column_name] == '[]', comparison_column_name] = 'EXACT MATCH'
    return df1

def Split_Left_Right_Match_Cols(match_cols, sufix_df1, sufix_df2):
    lefton = []
    righton = []
    for cols in match_cols:
        lefton.append(cols[0] + ' {' + sufix_df1 +'}')
        righton.append(cols[1] + ' {' + sufix_df2 + '}')
    return lefton, righton

def Column_Merged_Name(df_merged, col, x_or_y):
    if x_or_y == 'x':
        for df_col in df_merged.columns:
            
            mod_col = col + '_' + x_or_y
            
            if df_col == col:
                return df_col
            elif df_col == mod_col:
                return mod_col
    else:
        for df_col in df_merged.columns[::-1]:
            print('df col', df_col)
            mod_col = col + '_' + x_or_y
            print('modcol', mod_col)
            if df_col == col:
                print('noty')
                return df_col
            elif df_col == mod_col:
                print('y')
                return mod_col

def Unique_Column_Pairs(col_list):
    unique = []
    for item in col_list:
        if item not in unique:
            unique.append(item)
    return unique

def parse_file_name_from_bracket_display(filename):
    file = filename.split('{')[0].strip()
    sheet = filename.split('{')[1].replace('}','').strip()
    print('file:', file, 'sheet:', sheet)
    return file, sheet


def translate_action_name(action):
    if action == 'Total':
        return 'sum'
    elif action == 'Count':
        return 'size'
    elif action == 'Minimum':
        return 'min'
    elif action == 'Maximum':
        return 'max'
    elif action == 'Average':
        return 'mean'


def combine_actions_for_each_column_into_array(actions):
    action_dict = {}
    for action_pair in actions:
        action = translate_action_name(action_pair[0])
        action_col = action_pair[1]
        if action not in action_dict:
            print('mw dic')
            action_dict[action_col] = [action]
            print(action_dict)
        else:
            print('olddic')
            action_dict[action_col].append(action)
            print(action_dict)
    return action_dict


def change_col_dtype(df, actions):
    for action_pair in actions:
        action = action_pair[0]
        action_col = action_pair[1]
        if action in ['Total', 'Minimum', 'Maximum', 'Average']:
            df[action_col] = pd.to_numeric(df[action_col])
    return df 


def calculate_metrics(filename, groups, actions):
    file, sheet = parse_file_name_from_bracket_display(filename)
    df = unmelt(file, sheet)
    df.reset_index(drop=True, inplace=True)
    print('unmelted')
    print(df)
    df = change_col_dtype(df, actions)
    action_dict = combine_actions_for_each_column_into_array(actions)
    print('groups:', groups)
    print('action dict:', action_dict)
    df_result = df.groupby(groups).agg(action_dict).reset_index()
    print('views result')
    print(df_result)
    return df_result



# OLD EXTRACT
if False:
    print("START OF AJAX POST submit_extract_parameters")
    print(request.POST)
    inputordescription = request.POST.get('parameters[inputordescription]')
    primary_file_name = request.POST.get('parameters[primaryfilename]')
    primary_header_row = int(request.POST.get('parameters[primaryheaderrow]'))
    primary_sheet_name = request.POST.get('parameters[primarysheetname]')
    values_to_extract_dataset = primary_file_name + ' {' +  primary_sheet_name + '}'

    values_to_extract_col = request.POST.get('parameters[inputfilecol]')
    primary_conditions = json.loads(request.POST.get('parameters[inputfileconditions]'))
    #ast.literal_eval(request.POST.get('parameters[inputfileconditions]'))
    describevalues = request.POST.get('parameters[describevalues]')

    secondary_file_name = request.POST.get('parameters[secondaryfilename]')
    secondary_sheet_name = request.POST.get('parameters[secondarysheetname]')
    secondaryextractcolname = request.POST.get('parameters[secondextractcol]')
    secondary_header_row = int(request.POST.get('parameters[secondheaderrow]'))

    third_file_name = request.POST.get('parameters[thirdfilename]')
    third_sheet_name = request.POST.get('parameters[thirdsheetname]')
    thirdextractcolname = request.POST.get('parameters[thirdextractcol]')
    third_header_row = int(request.POST.get('parameters[thirdheaderrow]'))

    fourth_file_name = request.POST.get('parameters[fourthfilename]')
    fourth_sheet_name = request.POST.get('parameters[fourthsheetname]')
    fourthextractcolname = request.POST.get('parameters[fourthextractcol]')
    fourth_header_row = int(request.POST.get('parameters[fourthheaderrow]'))

    secondaryheaderrow = request.POST.get('parameters[secondaryheaderrow]')
    thirdheaderrow = request.POST.get('parameters[thirdheaderrow]')
    fourthheaderrow = request.POST.get('parameters[fourthheaderrow]')

    algorithm_type = 'Extract'
    extract_from = [[secondary_file_name, '{' + secondary_sheet_name + '}', secondaryextractcolname],
                    [third_file_name, '{' + third_sheet_name + '}', thirdextractcolname],
                    [fourth_file_name, '{' + fourth_sheet_name + '}', fourthextractcolname]]                
    df1 = None
    df2 = None
    df3 = None
    df4 = None
    print('primary names', primary_file_name, primary_sheet_name)
    df1 = unmelt(primary_file_name, primary_sheet_name)
    df1_name = primary_file_name + ' {' + primary_sheet_name + '}'
    if secondary_file_name != None:
        df2 = unmelt(secondary_file_name, secondary_sheet_name)
        df2_name = secondary_file_name + ' {' + secondary_sheet_name + '}'
    if third_file_name != None:
        df3 = unmelt(third_file_name, third_sheet_name)
        df3_name = third_file_name + ' {' + third_sheet_name + '}'
    if fourth_file_name != None:
        df4 = unmelt(fourth_file_name, fourth_sheet_name)
        df4_name = fourth_file_name + ' {' + fourth_sheet_name + '}'
    if primary_header_row > 0:
        print("CHANGING HEADER1")
        df1 = change_header(df1, primary_header_row)
    if secondary_header_row > 0:
        print("CHANGING HEADER2")
        df2 = change_header(df2, secondary_header_row)
    if third_header_row > 0:
        print("CHANGING HEADER3")
        df3 = change_header(df3, third_header_row)
    if fourth_header_row > 0:
        print("CHANGING HEADER4")
        df4 = change_header(df4, fourth_header_row)
    if primary_conditions != []: # not sure why this exists only for primary and there is another area to apply_conditions()
        print('conditions applied 1')
        df1 = apply_conditions(df1, primary_conditions) 
    print('dataframenames')
    print(df1)
    print(df2)
    if df1 is not None and df2 is None:
        dfs = {df1_name:df1}
    elif df1 is not None and df2 is not None and df3 is None:
            dfs = {df1_name:df1, df2_name:df2}
    elif df1 is not None and df2 is not None and df3 is not None and df4 is None:
        dfs = {df1_name:df1, df2_name:df2, df3_name:df3}
    elif df1 is not None and df2 is not None and df3 is not None and df4 is None:
        dfs = {df1_name:df1, df2_name:df2, df3_name:df3, df4_name:df4}

    if algorithm_type == 'Extract':
        print('Algorithm Type', algorithm_type)
        df_result = Extract(dfs, values_to_extract_dataset, values_to_extract_col, extract_from)
        print('------------- RESULT --------------')
        print(df_result)
        df_list = melt_df(df_result)
        print("saving result to db...")
        for dbframe in df_list:
            obj = KeyValueDataFrame_Result.objects.create(key=dbframe[0], val=dbframe[1])