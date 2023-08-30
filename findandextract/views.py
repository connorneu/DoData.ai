from fileinput import filename
from sqlite3 import DatabaseError
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
import pandas as pd
from django.core.files.storage import FileSystemStorage
from .models import KeyValueDataFrame
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


# Create your views here.

def findandextract(request):
    if request.method == 'POST':
        print("POST REQUEST MADE")
        if is_ajax(request): 
            print('AJAX POST REQUEST')
            #try:
            if request.POST.get('ajax_name') == 'submit_parameters':
                print("START OF AJAX POSTN Data")
                print(request.POST)
                if False:
                    algorithm_type = request.POST.get('algorithm_type')
                    values_to_extract_dataset = request.POST.get('values_to_extract_dataset')
                    values_to_extract_col = request.POST.get('values_to_extract_col')
                    extract_from = request.POST.get('extract_from')

                    primary_file_name = request.POST.get('primary_file_name')
                    primary_sheet_name = request.POST.get('primary_sheet_name')
                    primary_header_row = int(request.POST.get('primary_header_row'))
                    primary_conditions = request.POST.get('condition_arr')
                
                    secondary_file_name = request.POST.get('secondary_file_name')
                    secondary_sheet_name = request.POST.get('secondary_sheet_name')
                    secondary_header_row = int(request.POST.get('secondary_header_row'))
                    secondary_conditions = request.POST.get('condition_arr2')    

                    third_file_name = request.POST.get('third_file_name')
                    third_sheet_name = request.POST.get('third_sheet_name')
                    third_header_row = int(request.POST.get('third_header_row'))
                    third_conditions = request.POST.get('condition_arr3')

                    fourth_file_name = request.POST.get('fourth_file_name')
                    fourth_sheet_name = request.POST.get('fourth_sheet_name')
                    fourth_header_row = int(request.POST.get('fourth_header_row'))
                    fourth_conditions = request.POST.get('condition_arr4')
                else:
                        algorithm_type = 'Extract'
                        values_to_extract_dataset = 'Address.csv {Sheet1}'
                        values_to_extract_col = 'Director'
                        extract_from = [['Address.csv {Sheet1}', 'Director'], ['Client Data.csv {Sheet1}', 'Client Name'], ['Client Values.csv {Sheet1}', 'Client Name'],['Program Info.csv {Sheet1}', 'Teachers']]

                        primary_file_name = 'Address.csv'
                        primary_sheet_name = 'Sheet1'
                        primary_header_row = 0
                        primary_conditions = []
                
                        secondary_file_name = 'Client Values.csv'
                        secondary_sheet_name = 'Sheet1'
                        secondary_header_row = 0
                        secondary_conditions = []    

                        third_file_name = 'Client Data.csv'
                        third_sheet_name = 'Sheet1'
                        third_header_row = 0
                        third_conditions = []

                        fourth_file_name = 'Program Info.csv'
                        fourth_sheet_name = 'Sheet1'
                        fourth_header_row = 0
                        fourth_conditions = []
                

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
                if primary_conditions != []:
                    print('conditions applied 1')
                    df1 = apply_conditions(df1, primary_conditions)   
                print('SECONDARY CONDITIONS', secondary_conditions)
                if secondary_conditions != []:
                    print('conditions applied 2')
                    df2 = apply_conditions(df2, secondary_conditions)
                if third_conditions != []:  
                    print('conditions applied 3')
                    df3 = apply_conditions(df3, third_conditions)
                if fourth_conditions != []:
                    print('conditions applied 4')
                    df4 = apply_conditions(df4, fourth_conditions)
                dfs = {df1_name:df1, df2_name:df2, df3_name:df3, df4_name:df4}
                if algorithm_type == 'Extract':
                    df_result = Extract(dfs, values_to_extract_dataset, values_to_extract_col, extract_from)
                    print('RESULT')
                    print(df_result)

                return HttpResponse(status=200)

                #except Exception as e:
                #    exc_type, exc_obj, exc_tb = sys.exc_info()
                #    fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
                #    print(exc_type, fname, exc_tb.tb_lineno)
                #    print(e)
                #    return HttpResponse(status=400)
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
            print("AJAX GET REQUEST")
            fande_db_data = list(KeyValueDataFrame.objects.values())
            return JsonResponse({'fande_data_dump' : fande_db_data})
        else:
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
    for df_col in extract_from:
        if df_col[0] != values_to_extract_dataset: 
            df_single_result = Search_Column_Values(dfs[df_col[0]], df_col[1], df_extract_values)
            if not df_single_result.empty:

                if df_result == None:
                    df_result = df_single_result
                else:
                    df_result.append(df_single_result, ignore_index=True)
    return df_result
            
def Search_Column_Values(df, col, df_extract_values):
    df_result = df[df[col].isin(df_extract_values)]
    return df_result

    
def Fake_Data():
    algorithm_type = 'Extract'
    values_to_extract_dataset = 'Address.csv {Sheet1}'
    values_to_extract_col = 'Director'
    extract_from = [['Address.csv', 'Sheet1'], ['Client Data.csv', 'Sheet1'], ['Client Values.csv', 'Sheet1'],['Program Info.csv', 'Sheet1']]

    primary_file_name = 'Address.csv'
    primary_sheet_name = 'Sheet1'
    primary_header_row = 0
    primary_conditions = []
                
    secondary_file_name = 'Client Values.csv'
    secondary_sheet_name = 'Sheet1'
    secondary_header_row = 0
    secondary_conditions = []    

    third_file_name = 'Client Data.csv'
    third_sheet_name = 'Sheet1'
    third_header_row = 0
    third_conditions = []

    fourth_file_name = 'Program Info.csv'
    fourth_sheet_name = 'Sheet1'
    fourth_header_row = 0
    fourth_conditions = []