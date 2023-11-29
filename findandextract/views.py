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

goog_w2v_model = None
nlp = None
threads = []
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

def findandextract(request):
    global threads
    if request.method == 'POST':
        print("POST REQUEST MADE")
        if is_ajax(request): 
            print('AJAX POST REQUEST')
            #try:
            if request.POST.get('ajax_name') == 'submit_extract_parameters':
                print("START OF AJAX POST submit_extract_parameters")
                print(request.POST)
                inputordescription = request.POST.get('parameters[inputordescription]')
                primary_file_name = request.POST.get('parameters[primaryfilename]')
                primary_header_row = int(request.POST.get('parameters[primaryheaderrow]'))
                primary_sheet_name = request.POST.get('parameters[primarysheetname]')
                values_to_extract_dataset = primary_file_name + ' {' +  primary_sheet_name + '}'

                values_to_extract_col = request.POST.get('parameters[inputfilecol]')
                primary_conditions = ast.literal_eval(request.POST.get('parameters[inputfileconditions]'))
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
                if primary_conditions[0][1] != 'Select Column':
                    print('conditions applied 1')
                    df1 = apply_conditions(df1, primary_conditions)   
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

                return HttpResponse(status=200)

                #except Exception as e:
                #    exc_type, exc_obj, exc_tb = sys.exc_info()
                #    fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
                #    print(exc_type, fname, exc_tb.tb_lineno)
                #    print(e)
                #    return HttpResponse(status=400)
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

            elif request.POST.get('ajax_name') == 'classify_text':
                print('POST: classify_text')
                user_desc = request.POST.get('user_algo_desc')
                all_related_str = Convert_Source_Sentence(user_desc, goog_w2v_model, nlp) 
                words_dic = Read_Category_Words()
                algo_type = hf_sent_sim_classification_model(all_related_str, words_dic)
                print('algo_type', algo_type)
                #return HttpResponse(status=200)
                return JsonResponse({'algo_type': algo_type})
            else:
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
            x = threading.Thread(target=Load_Language_Model)
            x.start()
            threads.append(x)
            return render(request, "findandextract/fandemain.html")
        #return render(request, "findandextract/fandemain.html", {'fande_data_dump' : fande_db_data})

def upload_data_files(request):
    print("UPLOADING FILES")
    print(request.FILES)
    if request.method == 'POST' and request.FILES['file_1']:
        print("Importing file 1...")
        print(request.FILES)
        myfile = request.FILES['file_1']  
        #file_names.append(myfile)
        print('melting df')
        df_columns, df_list = build_df_melt(myfile)
        print("saving to db...")
        for dbframe in df_list:
            obj = KeyValueDataFrame.objects.create(file_name=dbframe[0], sheet_name=dbframe[1], key=dbframe[2], val=dbframe[3])           
            #obj.save()
        db_data = list(KeyValueDataFrame.objects.values())
        #return redirect("findandextract")
    if 'file_2' in request.FILES:
        if request.method == 'POST' and request.FILES['file_2']:    
            print('Importing file 2...')
            myfile2 = request.FILES['file_2']     
            #file_names.append(myfile2)
            print('melting df')
            df2_columns, df2_list = build_df_melt(myfile2)
            print('saving to db...')
            for dbframe in df2_list:
                obj = KeyValueDataFrame.objects.create(file_name=dbframe[0], sheet_name=dbframe[1], key=dbframe[2], val=dbframe[3])           
                #obj.save()
            db_data = list(KeyValueDataFrame.objects.values())
    if 'file_3' in request.FILES:
        if request.method == 'POST' and request.FILES['file_3']:    
            print('Importing file 3...')
            myfile3 = request.FILES['file_3']     
            #file_names.append(myfile2)
            print('melting df')
            df3_columns, df3_list = build_df_melt(myfile3)
            print('saving to db...')
            for dbframe in df3_list:
                obj = KeyValueDataFrame.objects.create(file_name=dbframe[0], sheet_name=dbframe[1], key=dbframe[2], val=dbframe[3])           
                #obj.save()
            db_data = list(KeyValueDataFrame.objects.values())
    if 'file_4' in request.FILES:
        if request.method == 'POST' and request.FILES['file_4']:    
            print('Importing file 4...')
            myfile4 = request.FILES['file_4']     
            #file_names.append(myfile2)
            print('melting df')
            df4_columns, df4_list = build_df_melt(myfile4)
            print('saving to db...')
            for dbframe in df4_list:
                obj = KeyValueDataFrame.objects.create(file_name=dbframe[0], sheet_name=dbframe[1], key=dbframe[2], val=dbframe[3])           
                #obj.save()
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


# for raw input
def build_df_melt(myfile):
    df_sheets = []
    file_ext = str(myfile).split('.')[-1]
    if file_ext[0] == 'x':
        df = pd.read_excel(myfile, sheet_name=None, engine='openpyxl')
        for name, sheet in df.items():
            sheet['sheet'] = name
            sheet = sheet.rename(columns=lambda x: x.split('\n')[-1])
            df_sheets.append(sheet)
        df = pd.concat(df_sheets)
        df.reset_index(inplace=True, drop=True)
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
    df.columns = df.iloc[header_row-1]    
    df = df.iloc[pd.RangeIndex(len(df)).drop(header_row-1)]
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
    conditions_reversed = json.loads(conditions)
    conditions = []
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
            condition[3] = condition[3].lower()

    conditions_str = 'df.loc['
    for i in range(0, len(conditions)):
        condition = conditions[i]
        if condition[2] == 'Equals':   
            #df_new = df.loc[df[condition[1]] == condition[3]]
            condition_str = '(df[\'' + condition[1] + '\'] == \'' + str(condition[3]) + '\')'
        if condition[2] == 'Contains':
            #df_new = df.loc[df[condition[1]].str.contains(str(condition[3]))]
            condition_str = '(df[\'' + condition[1] + '\'].str.contains(str(\'' + str(condition[3]) + '\')))'
        if condition[2] == 'Between':
            #df_new = df.loc[(df[condition[1]] > condition[3]) & (df[condition[1]] < condition[4])]
            condition_str = '(df[\'' + condition[1] +'\'] >' + str(condition[3]) + ') & (df[\'' + condition[1] + '] <' + str(condition[4]) + ')'
        if condition[2] == 'Greater Than':
            #df_new = df.loc[df[condition[1]] > condition[3]]
            condition_str = '(df[\'' + condition[1] + '\'] >' + str(condition[3]) + ')'
        if condition[2] == 'Less Than':
            #df_new = df.loc[df[condition[1]] < condition[3]]
            condition_str = '(df[\'' + condition[1] + '\'] <' + str(condition[3]) + ')'
            print('CONDITIOON 3 TYPE', type(condition[3]))
        if condition[2] == 'Not Equal To':
            #df_new = df.loc[df[condition[1]] != condition[3]]
            condition_str = '(df[\'' + condition[1] + '\'] !=' + str(condition[3]) + ')'
        if condition[2] == 'Does Not Contain':
            #df_new = df[~df[condition[1]].str.contains(condition[3])]
            condition_str = '(~df[\'' + condition[1] + '\'].str.contains(\'' + str(condition[3]) + '\'))'
        if i == 0:
            conditions_str += condition_str
        else:
            if condition[0] == 'And':
                conditions_str += ' & ' + condition_str
            if condition[0] == 'Or':
                conditions_str += ' | ' + condition_str
        if i == (len(conditions)-1):
            conditions_str += ']'
    print("CONDITIONS STRING")
    print(conditions_str)
    df_new = eval(conditions_str)
    return df_new
                        

def Extract(dfs, values_to_extract_dataset, values_to_extract_col, extract_from):
    df_result = None
    df_extract_values = dfs[values_to_extract_dataset][values_to_extract_col].values.tolist()
    all_df_col_headers = Collect_All_Col_Headers(dfs, extract_from, values_to_extract_dataset)
    cols_in_multiple_dfs = [item for item, count in collections.Counter(all_df_col_headers).items() if count > 1]
    for df_col in extract_from:
        if df_col[0] != values_to_extract_dataset: 
            wb_ws = df_col[0] + ' ' + df_col[1]
            col_to_find = df_col[2]
            df_single_result = Search_Column_Values(dfs[wb_ws], col_to_find, df_extract_values)
            #change matched column name so all matched columns have same name and can be stacked
            matched_col_header = values_to_extract_col + ' [Matched Column]'
            df_single_result = df_single_result.rename(columns={col_to_find: matched_col_header})
            all_df_col_headers.remove(col_to_find)
            df_single_result = Add_Filename_ColHeader(df_single_result, wb_ws, matched_col_header, cols_in_multiple_dfs)
            if not df_single_result.empty:
                df_single_result.columns=df_single_result.columns.astype('str')
                df_single_result['Dataset'] = wb_ws
                if not isinstance(df_result, pd.DataFrame):
                    df_result = df_single_result
                else:
                    df_result = pd.concat([df_result, df_single_result], ignore_index=True)
                    df_result = df_result.reset_index(drop=True)
    print(all_df_col_headers)
    df_result = Reorder_Columns(df_result, matched_col_header, all_df_col_headers)
    return df_result

def Collect_All_Col_Headers(dfs, extract_from, values_to_extract_dataset):
    all_df_col_headers = []
    for df_col in extract_from:
        if df_col[0] != values_to_extract_dataset:
            wb_ws = df_col[0] + ' ' + df_col[1]
            for col in dfs[wb_ws].columns.tolist():
                all_df_col_headers.append(col)
    return all_df_col_headers

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