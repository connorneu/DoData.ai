#from fileinput import filename
#from sqlite3 import DatabaseError
from django.shortcuts import render
from django.http import HttpResponse
#from django.http import HttpResponse, HttpResponseRedirect
import pandas as pd
#from django.core.files.storage import FileSystemStorage
#from django.http import StreamingHttpResponse
from .models import KeyValueDataFrame
from .models import KeyValueDataFrame_Result
from .models import KeyValueDataFrame_Display_Result
from .models import KeyValueDataFrame_Display
import os
from django.http import JsonResponse
import json
from django.shortcuts import redirect
#from django.urls import reverse
#import math
#from .forms import DataFilters 
import json
#import sys
#import time
from pandas.api.types import CategoricalDtype
import numpy as np
import json
from .languagemodel import *
from .describealgo import *
from .desc_algo import *
#import threading
import os
import ast
import collections
#from functools import reduce
import traceback
from django.db import connection
import csv
import logging
from dateutil.parser import parse
from django.http import FileResponse
from django.contrib.auth.decorators import login_required
import re
from io import BytesIO


goog_w2v_model = None
nlp = None
threads = []
nli = None
display_table_row_num = 999
MAX_UPLOAD_SIZE = 3145728 #3mb 

# REMOVE THIS AFTER DEBUG
# ALL IS LOST IF THIS IS NOT REMOVED
# THESE LINES NEED TO BE REMOVED AFTER DEBUG
#from django import db
#db.reset_queries()

# Create your views here.
log = logging.getLogger(__name__)


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


def clean_username(user):
    username = re.sub(r'\W+', '', user)
    return username


# @login_required()
def findandextract(request):
    global nli
    global threads
    global display_table_row_num
    print(request.user)
    if request.method == 'POST':
        if is_ajax(request): 
            log.info(request)
            if request.POST.get('ajax_name') == 'filter_data':
                try:
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
                    my_algo_type = request.POST.get('algo_type')
                    print('aglotype:', my_algo_type)
                    df = unmelt(table_name, sheet_name, request.user)
                    df_og = df.copy(deep=True)
                    if header_row > 0:
                        df = change_header(df, header_row)
                    if conds[0][1] != 'Select Column':
                        df = apply_conditions(df, conds)
                        print('apply conditions')
                        if isinstance(df, str):
                            warnings = df
                            log.error("An error occurred during calculate method: " + warnings, exc_info=True)
                            return HttpResponse(warnings, status=400) 
                        elif df.equals(df_og) or df.empty:                                        
                            warnings = "Conditions did not return any mathching rows. No conditions applied to dataset."
                            log.error("An error occurred during calculate method. Conditions did not return any mathching rows", exc_info=True)
                            return HttpResponse(warnings, status=400) 
                            #return JsonResponse({'fande_data_dump' : fande_db_data, 'warnings': warnings})#(warnings, status=400) 
                    if header_row > 0 or conds[0][1] != 'Select Column':
                        if my_algo_type == 'Filter':
                            print('itsalfilter')
                            write_results(df, df.head(display_table_row_num), str(request.user))
                            return HttpResponse(status=200)
                        else:
                            print('deleting old records')
                            objs_del = KeyValueDataFrame.objects.filter(file_name=table_name, sheet_name=sheet_name, uid=request.user)
                            objs_del.delete()
                            objs_disp_del = KeyValueDataFrame_Display.objects.filter(file_name=table_name, sheet_name=sheet_name, uid=request.user)
                            objs_disp_del.delete()
                            df_list = melt_filtered_df(df, table_name, sheet_name, str(request.user))
                            write_upload_files_raw(df_list, request, '0')
                            #db_obj_list = []
                            #for dbframe in df_list:                    
                            #    db_obj_list.append(KeyValueDataFrame(file_name=dbframe[0], sheet_name=dbframe[1], key=dbframe[2], val=dbframe[3], uid=request.user))
                            #KeyValueDataFrame.objects.bulk_create(db_obj_list)                    
                            fande_db_data = return_1k_rows_display(request)
                            return JsonResponse({'fande_data_dump' : fande_db_data})
                    else:     
                        fande_db_data = return_1k_rows_display(request) 
                        return JsonResponse({'fande_data_dump' : fande_db_data})
                except Exception:
                    traceback.print_exc()
                    log.critical("A critical error occured during filter data.", exc_info=True)
                    return HttpResponse('Critical Error. Please try again.', status=500) 
            elif request.POST.get('ajax_name') == 'extract':
                try:
                    print("START OF AJAX POST submit_extract_parameters")
                    print(request.POST)
                    params = json.loads(request.POST.get('parameters'))
                    input_or_description = params['input_or_description'].rstrip().strip()
                    extract_file_name = params['extractfilename'].rstrip().strip()
                    extract_col_name = params['extractcolname'].rstrip().strip()
                    describe_values_raw = ast.literal_eval(params['describevalues'])
                    describe_values = clean_describe_values(describe_values_raw)
                    find_file_1 = params['findfile1'].rstrip().strip()
                    find_col_1 = params['findcol1'].rstrip().strip()
                    find_file_2 = params['findfile2'].rstrip().strip()
                    find_col_2 = params['findcol2'].rstrip().strip()
                    find_file_3 = params['findfile3'].rstrip().strip()
                    find_col_3 = params['findcol3'].rstrip().strip()
                    search_where = [[find_file_1, find_col_1], [find_file_2, find_col_2], [find_file_3, find_col_3]]
                    pub_df_result = Extract(input_or_description, extract_file_name, extract_col_name, describe_values, search_where, request.user)
                    print('------------- RESULT --------------')
                    print(pub_df_result)
                    write_results(pub_df_result, pub_df_result.head(display_table_row_num), str(request.user))
                    #write_result_raw(df_result, request)
                    return HttpResponse(status=200)
                except Exception:
                    traceback.print_exc()
                    log.critical("A critical error occured during extract algorithm.", exc_info=True)
                    return HttpResponse('Critical Error. Please try again.', status=500) 
            elif request.POST.get('ajax_name') == 'combine_merge':
                try:
                    print("START OF AJAX POST combine_merge")
                    print(request.POST)
                    joins = request.POST.get('parameters')
                    joins = json.loads(joins)
                    df_result_combine = Combine_Merge(joins, request.user)
                    print('------------- RESULT --------------')
                    print(df_result_combine)
                    write_results(df_result_combine, df_result_combine.head(display_table_row_num), str(request.user))
                    #write_result_raw(df_result, request)
                    return HttpResponse(status=200)
                except:
                    traceback.print_exc()
                    log.critical("A critical error occured during combine algorithm.", exc_info=True)
                    return HttpResponse('Critical Error. Please try again.', status=500) 
            elif request.POST.get('ajax_name') == 'update_file':
                try:
                    print("START OF AJAX POST update file")
                    print(request.POST)
                    params = json.loads(request.POST.get('parameters'))
                    df_result_update = Update(params, request.user)
                    print('----------------RESULT---------------')
                    print(df_result_update)
                    if isinstance(df_result_update, str):
                        warnings = df_result_update
                        log.error("An error occurred during calculate method: " + warnings, exc_info=True)
                        return HttpResponse(warnings, status=400)  
                    write_results(df_result_update, df_result_update.head(display_table_row_num), str(request.user))
                    #write_result_raw(df_result, request)
                    return HttpResponse(status=200)    
                except Exception:
                    traceback.print_exc()
                    log.critical("A critical error occured during update method.", exc_info=True)
                    return HttpResponse('Critical Error. Please try again.', status=500) 
            elif request.POST.get('ajax_name') == 'reconcile':
                try:
                    print("START OF AJAX POST reconcile")
                    print(request.POST)
                    parameters = request.POST.get('parameters')
                    parameters = json.loads(parameters)
                    first_file = parameters['first_file']
                    second_file = parameters['second_file']
                    cols_to_match = parameters['matches']
                    cols_to_compare = parameters['compares']
                    print(cols_to_compare[0])
                    df_result_reco = Reconcile_Files(first_file, second_file, cols_to_match, cols_to_compare, request.user)
                    if isinstance(df_result_reco, pd.DataFrame): 
                        print('------------- RESULT --------------')
                        print(df_result_reco)
                        write_results(df_result_reco, df_result_reco.head(display_table_row_num), str(request.user))
                        #write_result_raw(df_result, request)
                        return HttpResponse(status=200)
                    else:
                        log.error('Error in calculate method', exc_info=True)
                        return HttpResponse(df_result_reco, status=400) 
                except Exception:
                    traceback.print_exc()
                    log.critical("A critical error occured during reconcile method.", exc_info=True)
                    return HttpResponse('Critical Error. Please try again.', status=500) 
            elif request.POST.get('ajax_name') == 'calculate':
                print('START OF AJAX POST calculate')
                print(request.POST)
                parameters = request.POST.get('parameters')
                parameters = json.loads(parameters)
                try:
                    df_result_calc = Calculate_Metrics(parameters, request.user)   
                    if isinstance(df_result_calc, pd.DataFrame): 
                        print('final result')
                        print(df_result_calc)
                        print('------------- RESULT --------------')
                        print(df_result_calc)
                        write_results(df_result_calc, df_result_calc.head(display_table_row_num), str(request.user))
                        #write_result_raw(df_result, request)
                        return HttpResponse(status=200)
                    else:
                        log.error('Error in Calcualte method', exc_info=True)
                        return HttpResponse(df_result_calc, status=400) 
                except Exception:
                    traceback.print_exc()
                    log.critical("A critical error occurred during Calculate group method", exc_info=True)
                    return HttpResponse('Critical Error. Please try again.', status=500)
            elif request.POST.get('ajax_name') == 'describe':
                print('START OF AJAX POST describe')
                print(request.POST)
                parameters = request.POST.get('parameters')
                parameters = json.loads(parameters)
                descriptiontext = parameters['descriptiontext']
                dataset = parameters['dataset']
                print('description')
                print(descriptiontext)
                print('dataset')
                print(dataset)
                try:
                    df_result_desc = apply_desc_algo_to_file(dataset, descriptiontext, str(request.user))   
                    if isinstance(df_result_desc, pd.DataFrame): 
                        print('final result')
                        print(df_result_desc)
                        print('------------- RESULT --------------')
                        print(df_result_desc)
                        write_results(df_result_desc, df_result_desc.head(display_table_row_num), str(request.user))
                        return HttpResponse(status=200)
                    else:
                        log.error('Error in Describe method', exc_info=True)
                        return HttpResponse(df_result_calc, status=400) 
                except Exception:
                    traceback.print_exc()
                    log.critical("A critical error occurred during Describe", exc_info=True)
                    return HttpResponse('Critical Error. Please try again.', status=500)
            elif request.POST.get('ajax_name') == 'classify_text':
                try:
                    print('POST: classify_text')
                    user_desc = request.POST.get('user_algo_desc')
                    #algo_type, algo_desc = classify_zeroshot(nli, user_desc)
                    algo_type = gpt_algo_desc(user_desc)
                    print('algo_type', algo_type)
                    #print('algo desc', algo_desc)
                    return JsonResponse({'algo_type': algo_type})
                    #return JsonResponse({'algo_type': algo_type, 'algo_desc': algo_desc})
                except:
                    traceback.print_exc()
                    log.critical("A critical error occurred during classify text method", exc_info=True)
                    return HttpResponse('Critical Error', status=500)  
            elif request.POST.get('ajax_name') == 'submit_user_formula':
                try:
                    print(request.POST)
                    parameters = request.POST.get('parameters')
                    print('params')
                    print(parameters)
                    params = ast.literal_eval(parameters)
                    user_text = params['user_text']
                    dataset = params['dataset']
                    new_col_name = params['new_col_name']
                    log.info(user_text)
                    file, sheet = parse_file_name_from_bracket_display(dataset)
                    df = unmelt(file, sheet, request.user)                    
                    df_result_formula, df_display_result_formula = Parse_User_Formula(df, user_text, new_col_name, request.user)
                    write_results(df_result_formula, df_display_result_formula, str(request.user))
                    #df_list = melt_df(df_result, request.user)
                    #write_result_raw(df_result, request)
                    #print("saving result to db...")
                    #db_obj_list = []
                    #for dbframe in df_list:
                    #    db_obj_list.append(KeyValueDataFrame_Result(key=dbframe[0], val=dbframe[1]))
                    #KeyValueDataFrame_Result.objects.bulk_create(db_obj_list)
                    #print('saved results')
                    return HttpResponse(status=200)
                except:
                    traceback.print_exc()
                    log.critical("A critical error occurred during user formula method - " + 'username: ' + str(request.user), exc_info=True)
                    return HttpResponse('There was an error. Please try again.', status=500)                 
            elif request.POST.get('ajax_name') == 'download_result':
                try:
                    print('downloading result.')
                    response = download_file(request)
                    #clear_user_data(request)
                    return response
                except:
                    traceback.print_exc()   
                    log.critical("A critical error occurred while downloading result - " + 'username: ' + str(request.user), exc_info=True)
                    return HttpResponse('There was an error. Please try again.', status=500) 
            elif request.POST.get('ajax_name') == 'gpt_algo_desc':
                print("thisistheonlyone submitting gpt desc text")
                print(request.POST)
                parameters = request.POST.get('parameters')
                params = ast.literal_eval(parameters)
                print('pam')
                print(params)
                user_desc = params['user_description']
                col_heads = params['col_heads']
                print("user_desc:", user_desc)
                print("col_heads:", col_heads)
                followups, original_question = make_gpt_request(user_desc, col_heads)
                print('VIEWS')
                print("Followupsz")
                print(followups)
                print("OGINIAL QUESTIONS")
                print(original_question)
                return JsonResponse({'followups' : followups, 'original_question' : original_question})

            elif request.method == 'POST': 
                try:
                    file = request.FILES['file']
                    print('AJAX file pos sheets')
                    print(request.POST)
                    myfile = request.FILES['file']
                    if check_mal_filename(str(myfile)):
                        warning = "Invalid File" 
                        log.warning('Invalid FileType: ' + str(myfile) + ' by user: ' + str(request.user))
                        print('Invalid FileType: ' + str(myfile) + ' by user: ' + str(request.user))
                        return HttpResponse(warning, status=400) 
                    sheets = get_sheet_names(myfile)
                    return JsonResponse({'sheets' : sheets})
                except:
                    try:
                        # why doesnt this work as a ajax request with a name
                        print('DATA UPLOAD POS')
                        print(request.POST)
                        print('user::', request.user)
                        print('startwrining')
                        warning = upload_data_files(request)
                        if warning:
                            print("WARNING")
                            return HttpResponse(warning, status=400) 
                        fande_db_data = return_1k_rows_display(request)
                        print('end uplod')
                        return JsonResponse({'fande_data_dump' : fande_db_data})
                    except Exception: 
                        print('upload data file failure')
                        traceback.print_exc()
                        log.critical("An error occurred during upload_data_files", exc_info=True)
                        return HttpResponse('Critical Error. ', status=500)  
        else:
            if 'submitdescpost' in request.POST: 
                print("submitting gpt desc text FUCK")
                print(request.POST)
                user_desc = request.POST.get('gptdesctext')
                col_heads = request.POST.get('desc-col-heads')
                orig_q = request.POST.get('orig-q')
                follow_q = request.POST.get('follow-q')
                follow_resp = request.POST.get('followup-resp')
                print("user_desc:", user_desc)
                print("col_heads:", col_heads)
                print('orig_q:', orig_q)
                print('follow_q:', follow_q)
                print('follow response:', follow_resp)
                user_code = make_gpt_request_code(user_desc, col_heads, orig_q, follow_q, follow_resp)
                filename = "doData.pyw"
                content = user_code
                response = HttpResponse(content, content_type='text/plain')
                response['Content-Disposition'] = 'attachment; filename=%s' % filename
                
                return response
            #try:
            #    print('nonajax post')
            #    print('downloading result.')
            #    print(request)
            #    print(request.POST)
            #    response = download_file(request)
            #    clear_user_data(request)
            #    return response
            #except:
            #    traceback.print_exc()
            #    log.critical("A critical error occurred while downloading result - " + 'username: ' + str(request.user), exc_info=True)
            #    return HttpResponse('There was an error. Please try again.', status=500) 
    else:
        try:
            print("GET REQUEST")
            if is_ajax(request):
                # return the result table to display
                if request.GET.get('ajaxid') == 'result_db': # ajaxid:'result_db'
                    print('getting reuslts')
                    #result_table_db = list(KeyValueDataFrame_Result.objects.filter(uid=str(request.user)).values())                    
                    result_table_db = get_result_db(request.user)
                    return JsonResponse({'result_table' : result_table_db})
                else:
                    print("AJAX GET REQUEST")
                    print('start longuest')
                    fande_db_data = return_1k_rows_display(request)
                    print('end longues')
                    return JsonResponse({'fande_data_dump' : fande_db_data})
            else:
                #clear_user_data(request)
                return render(request, "findandextract/fandemain.html")
        except:
            traceback.print_exc()
            log.critical("An error occurred when making request", exc_info=True)
            return HttpResponse('Critical Error', status=500)  


def download_executable():
    uid = clean_username(str(request.META['REMOTE_ADDR']))
    clear_user_tmp_dir(uid)
    print('cleanedIP:', uid)
    tmp_dir = create_tmp_dir_no_login(uid)
    print('temp dir:', tmp_dir)
    main_path = os.path.join(tmp_dir, 'main.py')
    print('main path:', main_path)
    with open(main_path, 'w+') as f:
        f.writelines(user_code)
    
    import PyInstaller.__main__
    work_dir = os.path.join(tmp_dir, 'work')
    dist_dir = os.path.join(tmp_dir, 'dist')
    PyInstaller.__main__.run([
        main_path,
        '--onefile',
        '--windowed',
        '--workpath', work_dir,
        '--distpath', dist_dir
    ]) 
    dist_path = os.path.join(dist_dir, 'main')
    with open(dist_path, 'rb') as f:
        content = f.read()
    response = HttpResponse(content, content_type='application/vnd.microsoft.portable-executable')
    response['Content-Disposition'] = 'attachment; filename=%s' % 'doData.exe'


def clear_user_data(request):
    print('clearing user data')
    KeyValueDataFrame.objects.filter(uid=str(request.user)).delete()
    KeyValueDataFrame_Display.objects.filter(uid=str(request.user)).delete()
    KeyValueDataFrame_Result.objects.filter(uid=str(request.user)).delete()
    KeyValueDataFrame_Display_Result.objects.filter(uid=str(request.user)).delete() 
    print('cleared user data')
    dir_name = os.path.join('./User Files', clean_username(str(request.user)) + '_datafiles')
    print('temp directory:', dir_name)
    if os.path.exists(dir_name):
        print('directory exists')
        delete_user_files(dir_name, str(request.user))
    else:
        print('temporary directory does not exist')

def clear_user_tmp_dir(uid):
    dir_name = os.path.join('./User Files', uid + '_datafiles')
    print('temp directory:', dir_name)
    if os.path.exists(dir_name):
        print('directory exists')
        delete_user_files(dir_name, uid)
    else:
        print('temporary directory does not exist')


def check_mal_filename(filename_raw):
    filename = str(filename_raw).lower()
    badchars = [';', ':', '>', '<', '/', '\\', '%', '$']
    verybad = ['web.config', '.htaccess', '.php']
    verygood = ['.csv', '.xlsx', '.xla', '.xlm', '.xls', '.xlsm', '.xlt', '.xltm', '.xltx', '.xlsb', '.txt', '.xlam']
    if filename.count('.') > 1:
        return True
    elif len(filename) > 250:
        return True
    elif any(c in filename for c in badchars):
        return True
    elif any(badname in filename for badname in verybad):
        return True
    else:
        for good in verygood:
            if filename.endswith(good):
                return False
        return True


def delete_user_files(tmp_dir, uid):
    files_ext_to_delete = ['.csv', '.xlsx', '.xla', '.xlm', '.xls', '.xlsm', '.xlt', '.xltm', '.xltx', '.xlsb', '.txt', '.xlam']
    try:
        for filename in os.listdir(tmp_dir):
            for ext in files_ext_to_delete:
                if filename.lower().endswith(ext):
                    print('removing:', filename)
                    os.remove(os.path.join(tmp_dir, filename))
        if os.path.exists(os.path.join(tmp_dir, 'compiled_dir')):
            for subfilename in os.listdir(os.path.join(tmp_dir, 'compiled_dir')):
                if subfilename.lower().endswith('.xlsx'):
                    print('removing subfile:', subfilename)
                    os.remove(os.path.join(os.path.join(tmp_dir, 'compiled_dir'), subfilename))
            os.rmdir(os.path.join(tmp_dir, 'compiled_dir'))
            print('removed sub dir:', os.path.join(tmp_dir, 'compiled_dir'))
        os.rmdir(tmp_dir)
        print('removed dir:', tmp_dir)
    except:
        print('FAILED TO DELETTE USER FILES')
        traceback.print_exc()
        log.critical('Failed to delete directory for username :' + uid, exc_info=True)


def download_file(request):
    uid = clean_username(str(request.user))
    print('uid', uid)
    usr_dir = create_tmp_dir(uid)
    print('usr_dir', usr_dir)
    result_csv_filename = uid + ' result.csv'
    csv_filepath = os.path.join(usr_dir, result_csv_filename)
    print('csv_filepath', csv_filepath)
    with open(csv_filepath, newline='') as f:
        reader = csv.reader(f, delimiter='~')
        data = list(reader)
    print('read csv')
    df = unmelt_result_df(data)
    with BytesIO() as b:
        # Use the StringIO object as the filehandle.
        writer = pd.ExcelWriter(b, engine='xlsxwriter')
        df.to_excel(writer, sheet_name='Sheet1', index=False)
        writer.close()
        # Set up the Http response.
        filename = 'Algorithm Result.xlsx'
        response = HttpResponse(
            b.getvalue(),
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename=%s' % filename
        return response


def download_file_DEPRECATE(request):
    uid = clean_username(str(request.user))
    print('uid', uid)
    usr_dir = create_tmp_dir(uid)
    print('usr_dir', usr_dir)
    result_csv_filename = uid + ' result.csv'
    csv_filepath = os.path.join(usr_dir, result_csv_filename)
    print('csv_filepath', csv_filepath)
    with open(csv_filepath, newline='') as f:
        reader = csv.reader(f, delimiter='~')
        data = list(reader)
    print('read csv')
    df = unmelt_result_df(data)
    print('result df')
    print(df)
    unmelted_result_path = os.path.join(usr_dir, 'Algorithm Result.xlsx')
    print('result path', unmelted_result_path)
    try:
        df.to_excel(unmelted_result_path, index=False)
    except:
        traceback.print_exc()
    print('writted to excel')
    response = FileResponse(open(unmelted_result_path, 'rb'), as_attachment=True)
    print('response')
    print(response)
    return response


# unmelt result data
def unmelt_result_df(result_db_data):
    key_val = []
    for row in result_db_data:
        key = row[0]
        val = row[1]
        key_val.append((key, val))
    df_melt = pd.DataFrame(key_val, columns=['key', 'val'])    
    df = df_melt.assign(idx=df_melt.groupby('key').cumcount())
    # convert column values to categories to prevent pandas from sorting alphabetically
    col_cats = f7(df['key'].values.tolist())
    cat_type = CategoricalDtype(categories=col_cats, ordered=True)
    df['key'] = df['key'].astype(cat_type)
    df = df.pivot(index='idx', columns='key', values='val')
    return df


# if user filters first 1000 rows out of data then tables will look empty
def return_1k_rows_display(request):
    return list(KeyValueDataFrame_Display.objects.filter(uid=str(request.user)).values())

# this is never used
def return_1k_rows_display_result(request):
    return list(KeyValueDataFrame_Display_Result.objects.filter(uid=str(request.user)).values())

def get_result_db(uid):
    # DO NOT DELETE
    #print("csv method")
    #csv_filename = str(uid) + ' result.csv'
    #with open(csv_filename, newline='') as f:
    #    reader = csv.reader(f, delimiter='~')
    #    data = list(reader)
    #    os.remove(csv_filename)
    #return data
    return list(KeyValueDataFrame_Display_Result.objects.filter(uid=str(uid)).values())


# worse version of write_display_result_to_db
def write_display_results(df_result, request):
    global display_table_row_num
    df_result_disp = df_result.head(display_table_row_num)
    df_disp_list = melt_df(df_result_disp, str(request.user))
    db_obj_list = []
    for dbframe in df_disp_list:                    
        db_obj_list.append(KeyValueDataFrame_Display_Result(key=dbframe[0], val=dbframe[1], uid=request.user))
    KeyValueDataFrame_Display_Result.objects.bulk_create(db_obj_list) 

#DESCHNOMISHIONED
# write result to result databse
def write_result_raw(df_result, request):
    print('writing display results')
    write_display_results(df_result, request)
    
    ## DO NOT FUCKING DELETE
    #df_list = melt_df(df_result, str(request.user))
    #print('writing to csv')
    #csv_filename = str(request.user) + ' result.csv'
    #with open(csv_filename, 'w', newline='') as f:
    #    writer = csv.writer(f, delimiter='~')
    #    writer.writerows(df_list)       
    #print('writing to db')
    #with open(csv_filename) as infile:
    #    with connection.cursor() as stmt:
    #        stmt.copy_from(infile, 'findandextract_keyvaluedataframe_result', sep="~", columns=['key', 'val', 'uid'])
    #os.remove(csv_filename)

def write_results(df_result, df_display_result, uid):
    write_result_to_db(df_result, uid)
    write_display_result_to_db(df_display_result, uid)

# better version of write_display_results
def write_display_result_to_db(df_display_result, uid):
    df_disp_list = melt_df(df_display_result, uid)
    db_obj_list = []
    for dbframe in df_disp_list:                    
        db_obj_list.append(KeyValueDataFrame_Display_Result(key=dbframe[0], val=dbframe[1], uid=uid))
    KeyValueDataFrame_Display_Result.objects.bulk_create(db_obj_list) 


def write_display_to_db(df_display, uid, myfile):
    global display_table_row_num
    df = df_display.head(display_table_row_num)
    df_keyvalue = df.melt(id_vars = ['sheet'])
    print('dropping unrelated datapoints...')
    df_keyvalue = drop_columns_from_unrelated_sheets(df_keyvalue)
    df_keyvalue['file_name'] = str(myfile)
    df_list = list(df_keyvalue[['file_name', 'sheet', 'variable', 'value']].values)
    db_obj_list = []
    for dbframe in df_list:                    
        db_obj_list.append(KeyValueDataFrame_Display(file_name=dbframe[0], sheet_name=dbframe[1], key=dbframe[2], val=dbframe[3], uid=uid))
    KeyValueDataFrame_Display.objects.bulk_create(db_obj_list) 
        #    #obj = KeyValueDataFrame.objects.create(file_name=dbframe[0], sheet_name=dbframe[1], key=dbframe[2], val=dbframe[3]) 
        #    db_obj_list.append(KeyValueDataFrame(file_name=dbframe[0], sheet_name=dbframe[1], key=dbframe[2], val=dbframe[3], uid=request.user))

def write_result_to_db(df_result, uid):
    # DO NOT FUCKING DELETE
    df_list = melt_df(df_result, uid)
    print('writing to csv')
    usr_dir = create_tmp_dir(clean_username(uid))
    result_csv_filename = clean_username(uid) + ' result.csv'
    csv_filepath = os.path.join(usr_dir, result_csv_filename)
    print("CSVFILEPATH:", csv_filepath)
    with open(csv_filepath, 'w', newline='') as f:
        writer = csv.writer(f, delimiter='~')
        writer.writerows(df_list)       
    #print('writing to db')
    #with open(csv_filepath) as infile:
    #    with connection.cursor() as stmt:
    #        write_upload_files_raw #df_list, request, filenum
        
def create_tmp_dir(uid):
    dir_name = os.path.join('./User Files', str(uid) + '_datafiles')
    if not os.path.exists(dir_name):
        os.makedirs(dir_name)
    return dir_name

def create_tmp_dir_no_login(uid):
    dir_name = os.path.join('./User Files', str(uid) + '_datafiles')
    if not os.path.exists(dir_name):
        os.makedirs(dir_name)
    return dir_name

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


# write uploaded files to db raw
def write_upload_files_raw(df_list, request, filenum):
    print('writing uploaded file', filenum)
    temp_dir = create_tmp_dir(clean_username(str(request.user)))
    list_to_write = []
    for elem in df_list:
        list_to_write.append([elem[0], elem[1], elem[2], elem[3], str(request.user)])
    csv_filename = clean_username(str(request.user)) + ' filenum' + str(filenum) + '.csv'
    csv_filepath = os.path.join(temp_dir, csv_filename)
    with open(csv_filepath, 'w', newline='') as f:
        writer = csv.writer(f, delimiter='~')
        writer.writerows(list_to_write)       
    with open(csv_filepath) as infile:
        with connection.cursor() as stmt:
            stmt.copy_from(infile, 'findandextract_keyvaluedataframe', sep="~", columns=['file_name', 'sheet_name', 'key', 'val', 'uid'])
    os.remove(csv_filepath)


def check_file(file):
    print('filesize: ', file.size)
    if file.size > MAX_UPLOAD_SIZE:
        return False
    else:
        return True


# call write uploaded files to db file for each individual file
def upload_data_files(request):
    print("UPLOADING FILES")
    print(request)
    total_file_size = 0
    if request.method == 'POST' and request.FILES['file_1']:
        print("Importing file 1...")
        print(request.FILES)
        filenum = 1
        myfile = request.FILES['file_1']
        if not check_file(myfile):
            return 'File size too big. Maximum upload size 4 Mb for all files.'
        total_file_size += myfile.size
        print('MYFILE')
        print(type(myfile))
        print(myfile)
        sheetname = request.POST['file_1_sheet']
        delimiter = request.POST['file_1_delimiter']
        df_columns, df_list = build_df_melt(myfile, sheetname, delimiter, str(request.user))
        write_upload_files_raw(df_list, request, filenum)
        #db_obj_list = []
        #for dbframe in df_list:
        #    #obj = KeyValueDataFrame.objects.create(file_name=dbframe[0], sheet_name=dbframe[1], key=dbframe[2], val=dbframe[3]) 
        #    db_obj_list.append(KeyValueDataFrame(file_name=dbframe[0], sheet_name=dbframe[1], key=dbframe[2], val=dbframe[3], uid=request.user))
        #KeyValueDataFrame.objects.bulk_create(db_obj_list)
        #print('saved')
        #db_data = list(KeyValueDataFrame.objects.values())
        #return redirect("findandextract")
    if 'file_2' in request.FILES:
        if request.method == 'POST' and request.FILES['file_2']:    
            print('Importing file 2...')
            myfile2 = request.FILES['file_2']   
            if not check_file(myfile2):
                return 'File size too big. Maximum total upload is 4 Mb.'  
            total_file_size += myfile2.size
            sheetname2 = request.POST['file_2_sheet']
            delimiter = request.POST['file_2_delimiter']
            df2_columns, df_list2 = build_df_melt(myfile2, sheetname2, delimiter, str(request.user))
            filenum = 2
            write_upload_files_raw(df_list2, request, filenum)
    if 'file_3' in request.FILES:
        if request.method == 'POST' and request.FILES['file_3']:    
            print('Importing file 3...')
            filenum = 3
            myfile3 = request.FILES['file_3']  
            if not check_file(myfile3):
                return 'File size too big. Maximum total upload is 4 Mb.'     
            total_file_size += myfile3.size        
            sheetname3 = request.POST['file_3_sheet']   
            delimiter = request.POST['file_3_delimiter']
            df3_columns, df_list3 = build_df_melt(myfile3, sheetname3, delimiter, str(request.user))
            write_upload_files_raw(df_list3, request, filenum)
    if 'file_4' in request.FILES:
        if request.method == 'POST' and request.FILES['file_4']:    
            print('Importing file 4...')
            myfile4 = request.FILES['file_4']  
            if not check_file(myfile4):
                return 'File size too big. Maximum total upload is 4 Mb.'
            total_file_size += myfile3.size  
            sheetname4 = request.POST['file_4_sheet']  
            delimiter = request.POST['file_4_delimiter']
            df4_columns, df_list4 = build_df_melt(myfile4, sheetname4, delimiter, str(request.user))
            filenum = 4
            write_upload_files_raw(df_list4, request, filenum)
    if total_file_size > MAX_UPLOAD_SIZE:
        return 'Files too large. Maximum total upload is 4 Mb.'
    

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

def melt_filtered_df(df, filename, sheetname, uid):
    df['sheet'] = sheetname
    df_keyvalue = df.melt(id_vars = ['sheet'])
    df_keyvalue['file_name'] = str(filename)
    df = replace_thilde(df)
    write_display_to_db(df, uid, filename)
    if 'variable' in df_keyvalue.columns:
        df_keyvalue.rename(columns={'variable':'key'}, inplace=True)
    df_list = list(df_keyvalue[['file_name', 'sheet', 'key', 'value']].values)
    return df_list


def get_sheet_names(myfile):
    file_ext = str(myfile).split('.')[-1]
    if 'xl' in file_ext:
        xl = pd.ExcelFile(myfile)
        print('sheetnames', xl.sheet_names)
        return xl.sheet_names
    else:
        return 'Sheet1'


def choose_delimiter(delimiter):
    if delimiter == 'tab':
        return '\t'
    else:
        return delimiter


# for raw input
def build_df_melt(myfile, sheetname, mydelimiter, uid):
    file_ext = str(myfile).split('.')[-1]
    print('file ext', file_ext)
    if 'xl' in file_ext:
        df = pd.read_excel(myfile, sheet_name=sheetname, engine='openpyxl')
        df['sheet'] = sheetname
    elif file_ext == 'txt':
        df = pd.read_csv(myfile, delimiter=choose_delimiter(mydelimiter))
        df['sheet'] = 'Sheet1'
    else:
        df = pd.read_csv(myfile)
        df['sheet'] = 'Sheet1'
    # replace all thildes as is delimiter for db
    df = replace_thilde(df)
    write_display_to_db(df, uid, myfile)
    df_columns = list(df.columns)
    df_keyvalue = df.melt(id_vars = ['sheet'])
    print('dropping unrelated datapoints...')
    df_keyvalue = drop_columns_from_unrelated_sheets(df_keyvalue)
    df_keyvalue['file_name'] = str(myfile)
    df_list = list(df_keyvalue[['file_name', 'sheet', 'variable', 'value']].values)
    return df_columns, df_list


# replace thilde as is delimiter for db
def replace_thilde(df):
    df = df.replace('~', '_', regex=True)
    df.columns = df.columns.str.replace("~", "_", regex=True)
    return df


# for dataframe input
def melt_df(df, user_id):
    df_k_v = df.melt()
    df_k_v['uid'] = user_id
    print("K AND V")
    print(df_k_v)
    try:
        print('melt: key value')
        df_list = list(df_k_v[['key', 'value', 'uid']].values)  #list(df_k_v[['key', 'value']].values)
    except:
        print('melt: variable value')
        df_list = list(df_k_v[['variable', 'value', 'uid']].values)
    return df_list

# if value for each columni n a sheet is NaN then drop after melt as it was appended to sheet name incorrectly
def drop_columns_from_unrelated_sheets(df):
    try:
        sheet_and_header_pairs = df[['sheet', 'variable']].values.tolist()
    except:
        df.rename(columns={'key':'variable'}, inplace=True)
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
def unmelt(file_name, sheet_name, username):
    db_data =  list(KeyValueDataFrame.objects.filter(uid=str(username)).values())
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
    print('REchange')
    print(list(df.columns.values))
    print(df.index.name)
    print(df)
    print('header:', header_row)
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


def int_or_float(s):
    try:
        return int(s), True
    except ValueError:
        try:
            return float(s), True
        except:
            try:
                d = parse(s)
                dt = d.strftime('%Y/%m/%d')
                return dt, False
            except:
                return 'Error'

def apply_conditions(df, conditions):
    print(df)
    print(conditions)
    df_new = df.copy()
    conditions_reversed = conditions
    conditions = []
    try:
        for condition in reversed(conditions_reversed):
            conditions.append(condition)

        condition_arr_and = []
        condition_arr_or = []
        for i in range(0, len(conditions)):
            print('hereisthecondition')
            print(condition)
            condition = conditions[i]
            if condition[2] == 'Between' or condition[2] == 'Greater Than' or condition[2] == 'Less Than':
                # check if number or date
                condition[3], isNum = int_or_float(condition[3])  
                if condition[4] != '':
                    condition[4], isNum = int_or_float(condition[4])              
                if isNum:
                    print("NUMNERCI CONDITION", condition)
                    df[condition[1]] = df[condition[1]].apply(pd.to_numeric, errors='coerce')
                else:
                    print("DATE CONDITIONS", condition)
                    df[condition[1]] = df[condition[1]].apply(pd.to_datetime, errors='coerce')
            if condition[3] == 'Error' or condition[4] == 'Error':
                return 'Can only use numeric values when filtering using Between, Greater Than, and Less than.'
            if condition[2] == 'Equals':   
                condition_str = df[condition[1]].str.lower() == str(condition[3]).lower()
            if condition[2] == 'Contains':
                condition_str = df[condition[1]].str.lower().str.contains(str(condition[3]).lower())     
            if condition[2] == 'Between':
                condition_str = (df[condition[1]] > condition[3]) & (df[condition[1]] < condition[4])
            if condition[2] == 'Greater Than':
                condition_str = df[condition[1]] > condition[3]
            if condition[2] == 'Less Than':
                condition_str = df[condition[1]] < condition[3]
            if condition[2] == 'Not Equal To':
                condition_str = df[condition[1]].str.lower() != str(condition[3]).lower()
            if condition[2] == 'Does Not Contain':
                condition_str = ~df[condition[1]].str.lower().str.contains(str(condition[3]).lower())
            if condition[2] == 'Starts With':
                condition_str = df[condition[1]].str.lower().str.startswith(str(condition[3]).lower())
            if condition[2] == 'Ends With':
                condition_str = df[condition[1]].str.lower().str.endswith(str(condition[3]).lower())
            if condition[0] == 'And':
                condition_arr_and.append(condition_str)
            else:
                condition_arr_or.append(condition_str)
        df_new_and = df.loc[np.logical_and.reduce(condition_arr_and)]
        if condition_arr_or:
            df_new_or = df.loc[np.logical_and.reduce(condition_arr_or)]
            df_new = pd.concat([df_new_and, df_new_or], ignore_index=False)
            df_new = df_new.drop_duplicates()
            df_new.sort_index(inplace=True)
        else:
            df_new = df_new_and
        print("DFNEW")
        print(df_new)
        return df_new
    except Exception:
        print("ERROR: CONDITIONS")
        log.error('Error applying conditions', exc_info=True)
        traceback.print_exc()
        return 'Error applying conditions.'                    

def Extract(input_or_description, extract_file_name, extract_col_name, describe_values, search_where, username):
    if input_or_description == 'input':
        df_extract_result = Extract_Input(extract_file_name, extract_col_name, search_where, username)
    else:
        df_extract_result = Extract_Describe(describe_values, username)

                
    #df_result = Reorder_Columns(df_result, matched_col_header, all_df_col_headers)
    return df_extract_result


def Extract_Describe(describe_values, username):
    df_result = None
    conds_by_file = Group_Conditions_By_File(describe_values)
    print('conds by file')
    print(conds_by_file)
    for file, conds in conds_by_file.items():
        file, sheet = parse_file_name_from_bracket_display(file)
        print("MeFile:", file, "MeConds", conds)
        df = unmelt(file, sheet, username)
        print("WEEECONDS")
        print(conds)
        resorted_conds = ReSort_Extract_Conds(conds)
        print("RESORTED")
        print(resorted_conds)
        df_single_result = apply_conditions(df, resorted_conds)
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
    return df_result


def ReSort_Extract_Conds(conds):
    resorted_conds = []
    for cond in conds:
        row = [cond[0].rstrip().strip(), cond[2].rstrip().strip(), cond[3].rstrip().strip(), cond[4].rstrip().strip(), cond[5].rstrip().strip()]
        resorted_conds.append(row)
    return resorted_conds



def Group_Conditions_By_File(describe_values):
    # get distinct list of file names
    print('describ e values')
    print(describe_values)
    files = []
    for cond in describe_values:
        print('cond1', cond[1])
        files.append(cond[1])
    # create dictionary of conditions per file
    conds = {}
    for cond in describe_values:
        if cond[1] in conds:
            conds[cond[1]].append(cond)
        else:
            conds[cond[1]] = [cond]        
    print('condsbyfile')
    for key, value in conds.items():
        print(key, value)
    return conds


def Extract_Input(extract_file_name, extract_col_name, search_where, username):
    df_result = None
    file, sheet = parse_file_name_from_bracket_display(extract_file_name)
    df = unmelt(file, sheet, username)
    df_extract_values = df[extract_col_name].values.tolist()
    common_col_name = search_where[0][1]
    for dataset_name, col in search_where:
        if dataset_name != 'Select Dataset':
            print(dataset_name, '|', col)
            file, sheet = parse_file_name_from_bracket_display(dataset_name)
            df = unmelt(file, sheet, username)
            df_single_result = Search_Column_Values(df, col, df_extract_values)
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


def Group_Same_File_Joins(params):
    grouped_params = []
    for i in range(len(params)):
        for j in range(len(params)):
            if i != j:
                if params[i][3] == params[j][3] and (params[i][0] != 'REMOVE' and params[j][0] != 'REMOVE'):
                    params[i][2].extend(params[j][2])
                    params[i][4].extend(params[j][4])
                    params[j][0] = 'REMOVE'
    for param in params:
        if param[0] != 'REMOVE':
            grouped_params.append(param)
    return grouped_params    



    
def Combine_Merge(join_params, username):
    grouped_params = Group_Same_File_Joins(join_params)
    df_result = None
    for join in grouped_params:
        file1, sheet1 = parse_file_name_from_bracket_display(join[1])
        file2, sheet2 = parse_file_name_from_bracket_display(join[3])
        df1 = unmelt(file1, sheet1, username)
        df2 = unmelt(file2, sheet2, username)
        file2_suffix = '_' + file2 + '_' + sheet2
        if not isinstance(df_result, pd.DataFrame):        
            df_single_result = pd.merge(df1, df2, left_on=join[2], right_on=join[4], how=join[0].split(' ')[0].lower(), suffixes=('', file2_suffix))
            df_result = df_single_result
        else:
            df_result = pd.merge(df_single_result, df2, left_on=join[2], right_on=join[4], how=join[0].split(' ')[0].lower(), suffixes=('', file2_suffix))
    if df_result is not None:
        df_result = df_result.drop_duplicates()
    return df_result


def Update(params, username):
    file_to_update = params['file_to_update']
    col_to_update = params['col_to_update']
    update_from_text = params['update_from_text']
    replace_file = params['replace_file']
    replace_col = params['replace_col']
    text_to_update = params['text_to_update']
    update_when = params['update_when']
    file, sheet = parse_file_name_from_bracket_display(file_to_update)
    df_to_update = unmelt(file, sheet, username)
    df_orig = df_to_update.copy()
    if update_from_text:        
        df_result = Update_From_Text_Input(update_when, df_to_update, text_to_update, col_to_update)
    else:
        df_result = Update_From_Input_File(replace_file, replace_col, update_when, df_to_update, col_to_update, username)
    if df_orig.equals(df_result):
        return 'Described conditions did not match any of the data. No changes have been applied.'
    return df_result


def build_type_of_cond(a, b, how):
    if how == 'Equals':  
        return a == b
    if how == 'Contains':
        return a.str.contains(b)     
    #if how == 'Between':
    #    return (df[condition[1]] > condition[3]) & (df[condition[1]] < condition[4])
    #if how == 'Greater Than':
    #    return a > b
    #if how == 'Less Than':
    #    return a < b
    if how == 'Not Equal To':
        return a.str.lower() != str(b).lower()
    if how == 'Does Not Contain':
        return ~a.str.contains(str(b).lower())
    if how == 'Starts With':
        return a.str.startswith(str(b))
    if how == 'Ends With':
        return a.str.endswith(str(b).lower())


def Update_From_Text_Input(update_when, df_to_update, text_to_update, col_to_update):
    whens = []
    equals = []
    hows = []
    for cols in update_when:
        whens.append(cols[0])
        equals.append(cols[1])
        hows.append(cols[2])
    num_conditions = len(equals)   
    if num_conditions == 1:
        a = df_to_update[whens[0]].str.lower()
        b = equals[0].lower()
        how = hows[0]
        df_to_update[col_to_update] = np.where(build_type_of_cond(a, b, how), text_to_update, df_to_update[col_to_update])
    elif num_conditions == 2:
        df_to_update[col_to_update] = np.where((build_type_of_cond(df_to_update[whens[0]].str.lower(), equals[0].lower(), hows[0])) & (build_type_of_cond(df_to_update[whens[1]].str.lower(), equals[1].lower(), hows[1])), text_to_update, df_to_update[col_to_update])
    elif num_conditions == 3:
        df_to_update[col_to_update] = np.where((build_type_of_cond(df_to_update[whens[0]].str.lower(), equals[0].lower(), hows[0])) & (build_type_of_cond(df_to_update[whens[1]].str.lower(), equals[1].lower(), hows[1])) & (build_type_of_cond(df_to_update[whens[2]].str.lower(), equals[2].lower(), hows[2])), text_to_update, df_to_update[col_to_update])
    elif num_conditions == 4:
        df_to_update[col_to_update] = np.where((build_type_of_cond(df_to_update[whens[0]].str.lower(), equals[0].lower(), hows[0])) & (build_type_of_cond(df_to_update[whens[1]].str.lower(), equals[1].lower(), hows[1])) & (build_type_of_cond(df_to_update[whens[2]].str.lower(), equals[2].lower(), hows[2])) & (build_type_of_cond(df_to_update[whens[3]].str.lower(), equals[3].lower(), hows[3])), text_to_update, df_to_update[col_to_update])
    else:
        return "Error"
    return df_to_update



def Update_From_Text_Input_ATTEMPT(update_when, df_to_update, text_to_update, col_to_update):
    whens = []
    equals = []
    for cols in update_when:
        whens.append(cols[0])
        equals.append(cols[1])
    num_conditions = len(equals)   
    if num_conditions == 1:
        df_to_update[col_to_update] = np.where(df_to_update[whens[0]].str.lower() == equals[0].lower(), text_to_update, df_to_update[col_to_update])
    elif num_conditions == 2:
        df_to_update[col_to_update] = np.where((df_to_update[whens[0]].str.lower() == equals[0].lower()) & (df_to_update[whens[1]].str.lower() == equals[1].lower()), text_to_update, df_to_update[col_to_update])
    elif num_conditions == 3:
        df_to_update[col_to_update] = np.where((df_to_update[whens[0]].str.lower() == equals[0].lower()) & (df_to_update[whens[1]].str.lower() == equals[1].lower()) & (df_to_update[whens[2]].str.lower() == equals[2].lower()), text_to_update, df_to_update[col_to_update])
    elif num_conditions == 4:
        df_to_update[col_to_update] = np.where((df_to_update[whens[0]].str.lower() == equals[0].lower()) & (df_to_update[whens[1]].str.lower() == equals[1].lower()) & (df_to_update[whens[2]].str.lower() == equals[2].lower()) & (df_to_update[whens[3]].str.lower() == equals[3].lower()), text_to_update, df_to_update[col_to_update])
    else:
        return "Error"
    return df_to_update


def Update_From_Input_File(replace_file, replace_col, update_when, df_to_update, col_to_update, username):
    file, sheet = parse_file_name_from_bracket_display(replace_file)
    df_replace = unmelt(file, sheet, username)
    temp_suffix = '__To_Replace__'
    replace_col_suffix = replace_col + temp_suffix
    df_replace = df_replace.add_suffix(temp_suffix)
    whens = []
    equals = []
    for cols in update_when:
        whens.append(cols[0])
        suffixed = cols[1] + temp_suffix
        equals.append(suffixed)
    df_result = pd.merge(df_to_update, df_replace, left_on=whens, right_on=equals, how='left')
    num_conditions = len(equals)
    if num_conditions == 1:
        df_result[col_to_update] = np.where(pd.isnull(df_result[equals[0]]), df_result[col_to_update], df_result[replace_col_suffix])
    elif num_conditions == 2:
        df_result[col_to_update] = np.where(pd.isnull(df_result[equals[0]]) & pd.isnull(df_result[equals[1]]), df_result[col_to_update], df_result[replace_col_suffix])
    elif num_conditions == 3:
        df_result[col_to_update] = np.where(pd.isnull(df_result[equals[0]]) & pd.isnull(df_result[equals[1]]) & pd.isnull(df_result[equals[2]]), df_result[col_to_update], df_result[replace_col_suffix])
    elif num_conditions == 4:
        df_result[col_to_update] = np.where(pd.isnull(df_result[equals[0]]) & pd.isnull(df_result[equals[1]]) & pd.isnull(df_result[equals[2]]) & pd.isnull(df_result[equals[3]]), df_result[col_to_update], df_result[replace_col_suffix])
    else:
        return "Error"
    for col in df_result:
        if temp_suffix in col:
            try:
                df_result.drop(col, inplace=True, axis=1)
            except:
                print('failed to drop', col)
    return df_result
            

def Update_From_File_DEPERECRATE(update_file_params, files_to_update_params):
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


def Unmelt_Files_To_Update(files_to_update_params, username):
    dfs_to_update = []
    df1 = unmelt(files_to_update_params[0][0], files_to_update_params[0][1], username)
    dfs_to_update.append(df1)
    if len(files_to_update_params) > 1:
        df2 = unmelt(files_to_update_params[1][0], files_to_update_params[1][1], username)
        dfs_to_update.append(df2)
    if len(files_to_update_params) > 2:
        df3 = unmelt(files_to_update_params[2][0], files_to_update_params[2][1], username)
        dfs_to_update.append(df3)
    if len(files_to_update_params) > 3:
        df4 = unmelt(files_to_update_params[3][0], files_to_update_params[4][0], username)
        dfs_to_update.append(df4)
    return dfs_to_update

def Reconcile_Files(first_file, second_file, match_cols, compare_cols, username):
    file1, sheet1 = parse_file_name_from_bracket_display(first_file)
    df1 = unmelt(file1, sheet1, username)
    file2, sheet2 = parse_file_name_from_bracket_display(second_file)
    df2 = unmelt(file2, sheet2, username)
    first_file_name = first_file.replace('.csv', '')
    second_file_name = second_file.replace('.csv', '')
    #df1 = df1.add_suffix(' _' + first_file_name)
    df2 = df2.add_suffix('_' + second_file_name)
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
    df1_og = df1.copy()
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
                df1.loc[np.logical_and.reduce(conds_df1_match), comparison_column_name] = 'Other Values: ' + str(list(set(val_variants)))  
                df1.loc[df1[comparison_column_name] == 'nan', comparison_column_name] = 'EXACT MATCH'
                df1.loc[df1[comparison_column_name] == '[]', comparison_column_name] = 'EXACT MATCH'
    if df1.equals(df1_og):
        df1 = 'No values matched in the specified columns.'
    return df1

def Split_Left_Right_Match_Cols(match_cols, sufix_df1, sufix_df2):
    lefton = []
    righton = []
    for cols in match_cols:
        lefton.append(cols[0]) # lefton.append(cols[0] + '_' + sufix_df1)
        righton.append(cols[1] + '_' + sufix_df2)
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


def combine_actions_for_each_column_into_array(actions, metric_cols):
    action_dict = {}
    metric_cols_sort = list(reversed(metric_cols))
    for i in range(len(actions)):
        action = translate_action_name(actions[i])
        action_col = metric_cols_sort[i]
        if action_col not in action_dict:
            action_dict[action_col] = [action]
        else:
            action_dict[action_col].append(action)
    return action_dict


def change_col_dtype(df, metric_cols):
    for metric_col in metric_cols:
        if metric_col != 'Count':
            try:
                df[metric_col] = pd.to_numeric(df[metric_col])
            except:
                raise Exception('Cannot calculate metric on this column. Metrics can only be calculated on numeric columns. All values in this column must be numeric.')
    return df


def Calculate_Metrics(parameters, username):
    try:
        filename = parameters['filename']
        groups = list(set(parameters['groups']))
        metrics = parameters['metrics']
        metric_cols = parameters['metric_cols']
        file, sheet = parse_file_name_from_bracket_display(filename)
        df = unmelt(file, sheet, username)
        df = change_col_dtype(df, metric_cols)
        action_dict = combine_actions_for_each_column_into_array(metrics, metric_cols)
        df_result = df.groupby(groups).agg(action_dict).reset_index()
        if len(metric_cols) != len(set(metric_cols)):
            df_result.columns = df_result.columns.map('_'.join)
        return df_result
    except Exception as e:
        return e