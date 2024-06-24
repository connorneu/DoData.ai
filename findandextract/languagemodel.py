#import traceback
#import nltk
import requests
#from nltk.corpus import wordnet
#from gensim import models
#from gensim.test.utils import datapath
import os
#from nltk.corpus import stopwords
#import spacy
import time
import sys
#from transformers import AutoTokenizer, AutoModelForSequenceClassification
#import torch
#from transformers import pipeline
from openai import OpenAI
import pandas as pd
#import xlsxwriter   
import formulas
#import numpy as np
import logging
import re
from decouple import config

SETTINGS_DIR = os.path.dirname(__file__)
print('settings', SETTINGS_DIR)
PROJECT_ROOT = os.path.abspath(os.path.dirname(SETTINGS_DIR))
print('root', PROJECT_ROOT)
MODELS_DIR = os.path.join(SETTINGS_DIR, 'static/models/')
print('models dir', MODELS_DIR)

log = logging.getLogger(__name__)

GOOGLE_NEG_300 = MODELS_DIR + 'GoogleNews-vectors-negative300.bin'
GOOGLE_NEG_300_Q = MODELS_DIR + 'google_news_neg300_q'
TOPIC_DESC_DIR = MODELS_DIR + '/Topic Descriptions/'
SPACY_EN_LG = "/lib/python3.10/site-packages/en_core_web_lg/en_core_web_lg-3.7.0"
TEMPORARY_EXCEL_DIR = '/fake data/formula results.xlsx'

def Parse_User_Formula(df, user_text, new_col_name, username):
    df = infer_col_dtypes(df)
    response = gpt(user_text)
    log.info('username: ' + str(username) + '\n' +response)
    formula, col_map_list = parse_response(response)
    log.info('username: ' + str(username) + '\n' + 'original formula: ' + formula)
    log.info('username: ' + str(username) + '\n' + 'column mapping: ' + str(col_map_list))
    revised_col_map_list = find_real_file_col_mapping(df, col_map_list)
    log.info('username: ' + str(username) + '\n' + 'revised column mapping: ' + str(revised_col_map_list))
    new_formula = update_formula_columns(formula, revised_col_map_list)
    log.info('username: ' + str(username) + '\n' + 'new formula: ' + str(col_map_list))
    increment_formula_list = create_incremented_formula(df.shape[0], revised_col_map_list, new_formula)
    log.info('username: ' + str(username) + '\n' + 'incremented formula 1 and 2: ' + str(increment_formula_list[0]) + ' | ' + str(increment_formula_list[1]))
    result_df = add_formula_openpyxl(df, increment_formula_list, new_col_name)
    tmp_usr_dir = Create_Tmp_Dir(clean_username(str(username)))
    df_uncompiled_path = os.path.join(tmp_usr_dir, 'Result DF.xlsx')
    df_display_uncompiled_path = os.path.join(tmp_usr_dir, 'Result DF Display.xlsx')
    df = convert_datetime_col_to_str(df)
    write_uncompiled_df_to_file(df, df_uncompiled_path, df_display_uncompiled_path)
    result_display_df = compile_excel_formulas(df_display_uncompiled_path, tmp_usr_dir)
    result_display_df = check_calculated_column_nan(new_col_name, result_display_df)
    return result_df, result_display_df


def clean_username(user):
    username = re.sub(r'\W+', '', user)
    return username


def check_calculated_column_nan(new_col_name, result_display_df):
    if result_display_df[new_col_name].isnull().values.all():
        result_display_df[new_col_name] = 'Download to view result'
    return result_display_df


def convert_datetime_col_to_str(df):
    for col in df:
        if 'date' in str(df[col].dtype).lower():
            df[col] = df[col].astype("string")
    return df


def compile_excel_formulas(df_uncompiled_path, tmp_usr_dir):
    compile_dir = os.path.join(tmp_usr_dir, 'compiled_dir')
    inpath, dirout = df_uncompiled_path, compile_dir
    xl_model = formulas.ExcelModel().loads(inpath).finish()
    xl_model.calculate()
    xl_model.write(dirpath=dirout)
    for filename in os.listdir(compile_dir):
        df_result = pd.read_excel(os.path.join(compile_dir, filename), index_col=None)
        break
    # eror handing if dfresult nul
    return df_result


def write_uncompiled_df_to_file(df, df_uncompiled_path, df_display_uncompiled_path):
    df.to_excel(df_uncompiled_path, index=False)
    df_display = df.head(99)
    df_display.to_excel(df_display_uncompiled_path, index=False)


def Create_Tmp_Dir(username):
    dir_name = os.path.join('./User Files', str(username) + '_datafiles')
    if not os.path.exists(dir_name):
        os.makedirs(dir_name)
    return dir_name


def infer_col_dtypes(df):
    cols = df.columns
    for c in cols:
        converted = False
        try:
            df[c] = pd.to_numeric(df[c])
            converted = True
        except:
            pass
        if not converted:
            try:                       
                df[c] = pd.to_datetime(df[c])
                converted = True
            except:
                pass
        if not converted:
            try:
                df[c] = df[c].astype('string')
            except:
                pass
    return df
    

def add_formula_openpyxl(df, new_formula, new_col):
    df[new_col] = new_formula
    return df


def update_formula_columns(formula, revised_col_map_list):
    pos_already_changed = []
    for map in revised_col_map_list:
        new_col = map[1]
        old_col = map[2]
        i = 0
        while i < len(formula):
            if i == len(formula)-1:
                potential_col_chars = formula[i]
            else:
                potential_col_chars = formula[i:i + len(old_col)]
            if potential_col_chars == old_col:
                if formula[i-1] != '=' and not formula[i-1].isalpha() and not formula[i:i + len(old_col) + 1].isalpha():
                    formula_l = list(formula)
                    if i not in pos_already_changed:
                        for p in range(len(old_col)):
                            formula_l.pop(i)
                            pos_already_changed.append(i)
                        new_col_idx = 0
                        for ins in range(i, i + len(new_col)):
                            formula_l.insert(ins, new_col[new_col_idx])
                            new_col_idx += 1
                        formula = ''.join(formula_l)
            i += 1
    return formula

def create_incremented_formula(num_rows, revised_col_map_list, new_formula):
    incremented_formula_list = []
    for rownum in range(2, num_rows+2):
        new_formula_rowise = new_formula
        for col_map in revised_col_map_list:
            char_to_find = col_map[1]
            i = 1
            while i < len(new_formula_rowise)-1:
                if new_formula_rowise[i:i+len(char_to_find)] == char_to_find:
                    if not new_formula_rowise[i-len(char_to_find):i].isalpha() and not new_formula_rowise[i+1:i+len(char_to_find)+1].isalpha():
                        new_formula_rowise = new_formula_rowise[:i] + char_to_find + str(rownum) + new_formula_rowise[i+1:]
                i += len(char_to_find)
        incremented_formula_list.append(new_formula_rowise)
    return incremented_formula_list


def find_real_file_col_mapping(df, col_map_list):
    revised_col_map_list = []
    # max zz
    alphabet = generate_excel_alphabet()
    for map in col_map_list:
        header = map[0]
        wrong_col_letter = map[1]
        counter = 0
        for col in df:
            if col == header:
                col_letter = alphabet[counter]
                revised_col_map_list.append((header, col_letter, wrong_col_letter))
                break
            counter += 1
    if len(col_map_list) != len(revised_col_map_list):
        print('ERORR AT find_real_file_col_mapping')
        print('Not all columns found when changing mapping')
        return None
    else:
        # sort - if unsorted and change B->A then A->C everything will be C
        revised_col_map_list = sorted(revised_col_map_list, key=lambda x: x[2])
        return revised_col_map_list
    

def generate_excel_alphabet():
    alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    alphabet_list = []
    max_col = 702
    cur_alpha_index = 0
    alphabet_looped = -1
    for i in range(max_col):
        if i < 26:
            alphabet_list.append(alphabet[i])
        else:
            alphabet_list.append(alphabet[alphabet_looped] + alphabet[cur_alpha_index])
        cur_alpha_index += 1
        if cur_alpha_index > 25:
            cur_alpha_index = 0
            alphabet_looped += 1
    return alphabet_list


def parse_split_delimiter(txt):
    if ':' in txt:
        split_char = ':'
    elif '=' in txt:
        split_char = '='
    elif '->' in txt:
        split_char = '->'
    elif '=>' in txt:
        split_char = '=>'
    else:
        split_char = '='
    return split_char
        

def parse_response(response):
    response = response.replace('`', '')
    response = os.linesep.join([s for s in response.splitlines() if s])
    formula_r = response.split('\n')[0]
    col_maps_r = response.split('\n')[1]
    formula = formula_r.replace('Formula:', '').rstrip().strip()
    if formula[0] == '\'' or formula[0] == '"' or formula[0] == '`':
        formula = formula[1:]
    if formula[-1] == '\'' or formula[-1] == '"' or formula[-1] == '`':
        formula = formula[:-1]
    col_maps_list = []
    col_maps = col_maps_r.replace('Column mapping:', '').rstrip().strip()
    if ',' in col_maps:
        col_maps_split = col_maps.split(',')
        for map in col_maps_split:
            split_char = parse_split_delimiter(map)
            key = map.split(split_char)[0].rstrip().strip()
            val = map.split(split_char)[1].rstrip().strip()
            col_maps_list.append((key, val))
    else:
        split_char = parse_split_delimiter(col_maps)
        key = col_maps.split(split_char)[0].rstrip().strip()
        val = col_maps.split(split_char)[1].rstrip().strip()
        col_maps_list.append((key, val))
    return formula, col_maps_list


def gpt(user_text):
    print('user question')
    print(user_text)
    SECRET = config('GPT_SECRET')
    # Authorization: SECRET
    client = OpenAI(api_key=SECRET)
    question = f"""
                Generate an excel formula based on below Question. The cell references in the formula need to be for the entire column. For example when refering to column A instead of A2 it should be A:A.
                Question: {user_text}. 
                The column names should match Excel column convention ie. A, B, C etc.
                Format the response exactly as below without additional text:
                Formula: only the excel formula based on below question. Use column letters to define columns just like in an Excel formula. The formula should be on one line.
                Column mapping: a mapping which maps the column names from the question to the Excel column letters in the response formula. Separate each mapping by a comma. Put all mappings on the same line.
                """

    stream = client.chat.completions.create(
        model="gpt-4-turbo-2024-04-09",
        messages=[{"role": "user", "content": question}],
        stream=True
    )
    response = ''
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            #print(chunk.choices[0].delta.content, end="")
            response += chunk.choices[0].delta.content
    print('response:')
    print(response)
    return response


def gpt_algo_desc(user_text):
    SECRET = config('GPT_SECRET')
    # Authorization: SECRET
    client = OpenAI(api_key=SECRET)
    question = f"""
                This is the user description: {user_text}
                Classify the user description into only one of the below classes.
                The result should only be the class label which is the word before the colon of each class.
                No other output should be printed.
                The classes are
                Extract: Search through one or multiple files and select all the rows that match the search criteria. The search criteria can be described values, a separate file containing other values, or filters to be applied to the data. Any row that matches the search criteria will be added to a result file and returned to the user.
                Combine: Combine two or more files by matching row values on common values. Wherever the defined row values in the columns containing common values match, the columns from both files will be combined into one file. A single result file containing columns from both files, where the row values matched, will be returned to the user. 
                Update: Update the values in a single file by describing which values to update or by uploading an additional file that contains the matching criteria and the update values. For a value to be updated, the user must describe a value in another column on the same row, what column contains the value to update, and what the updated value is. The single file is returned to the user after the updates are applied.
                Reconcile: Compare two files and determine which values in the common columns match and do not match. The user must describe which columns in both files must have the same row values to compare. The user then supplies which columns contain the row values to compare. The user is returned a single file containing the first file as well as additional columns which describe the other values that exist in the second file when the matching criteria is met.
                Columns: Generate an Excel formula based on the user decription of what they are trying to build. The user inputs a description of what they want the newly created calculated column to calculate. The user must also upload the file which they want the newly created formula applied to. The result is the original dataset with a newly created column containing the newwly created formula.
                Group: Group data together in a single file using one or several columns as the grouping criteria where equal values on multiple rows are collapsed into one row and metrics are calculated for the columns which are not being collapsed. The user is returned a file where the rows  in the columns specified as the columns to group together are collapsed into one row, and the columns which had been indicated as those to calculate metrics for have their metrics calcualted.              
                Filter: Filter a single dataset by applying conditions to columns. 
                """

    stream = client.chat.completions.create(
        model="gpt-4-turbo-2024-04-09",
        messages=[{"role": "user", "content": question}],
        stream=True
    )
    response = ''
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            #print(chunk.choices[0].delta.content, end="")
            response += chunk.choices[0].delta.content
    print('response:')
    print(response)
    return response


def Build_Quick_Gensim_Model():
    #goog_w2v_model = models.Word2Vec.load_word2vec_format(GOOGLE_NEG_300, binary=True)
    goog_w2v_model = models.KeyedVectors.load_word2vec_format(datapath(GOOGLE_NEG_300), binary=True)
    goog_w2v_model.save(GOOGLE_NEG_300_Q)

def Load_Gensim_Model():
    # SPEEDING UP GENSIM https://stackoverflow.com/questions/42986405/how-to-speed-up-gensim-word2vec-model-load-time
    goog_w2v_model = models.KeyedVectors.load_word2vec_format(GOOGLE_NEG_300, binary=True)
    return goog_w2v_model

def Load_Gensim_Model_Quick():
    goog_w2v_model = models.KeyedVectors.load(GOOGLE_NEG_300_Q, mmap='r')
    return goog_w2v_model


#https://huggingface.co/MoritzLaurer/DeBERTa-v3-base-mnli-fever-anli?candidate_labels=join+two+datasets+on+either+row+values+or+column+headers+to+combine+the+values+into+one+dataset%2C+select+rows+of+data+from+one+or+multiple+files+based+on+an+uploaded+list+or+specified+conditions%2C+reconcile+values+in+two+similar+datasets+by+matching+common+values+and+comparing+the+other+columns%2C+replace+the+values+in+a+dataset+with+updated+values+from+an+uploaded+list+or+specified+conditions&multi_class=false&text=search+for+the+first+name+and+join+the+column+with+the+last+name
def Load_NLI_Model():
    # faster worse 
    #classifier = pipeline("zero-shot-classification", model="MoritzLaurer/DeBERTa-v3-base-mnli-fever-anli")
    # slower better
    classifier = pipeline("zero-shot-classification", model="MoritzLaurer/DeBERTa-v3-large-mnli-fever-anli-ling-wanli")
    return classifier

def classify_zeroshot(classifier, user_text):
    candidate_labels = ["combine files",
                        "select values",
                        "compare files",
                        "change values",
                        "calculate metrics"]
    output = classifier(user_text, candidate_labels, multi_label=False)
    print('classifier output:', output)
    scores = output['scores']
    result_index = scores.index(max(scores))
    result_raw = output['labels'][result_index]
    result_word = {'combine files': 'combine', 'select values': 'extract', 'compare files': 'reconcile', 'change values': 'update', 'calculate metrics': 'calculate'}#
    result_desc = {'combine': 'Combine two or more datasets into one file by searching for common values and adding columns where they match.',
                   'extract': 'Select rows of data from one or multiple files based on values or conditions and extract them into one file.',
                   'reconcile': 'Reconcile values of two datasets by matching rows and comparing similarities and differences.',
                   'update': '<u>Change values in one or more files:</u> <br><br> Describe what you want to find. <br><br> Search through your files for these values. <br><br> Change the values on the same row.',
                   'calculate': 'Calculate metrics for your data by grouping rows together based on column values.'}
    result = result_word[result_raw]
    result_desc = result_desc[result]
    print('result:', result)
    print('result description:', result_desc)
    return result, result_desc


def gensim_word2vec(goog_w2v_model):
    topn = 25
    topic_words = [['extract', 'find', 'filter', 'select', 'choose'],
                   ['combine', 'join', 'merge', 'together', 'consolidate'],
                   ['update', 'modify', 'alter', 'revise', 'refresh'],
                   ['reconcile', 'compare', 'match', 'difference', 'similarities']]
    for topic in topic_words:
        print('topic', topic)
        first_sim = goog_w2v_model.most_similar(topic[0], topn=topn)
        second_sim = goog_w2v_model.most_similar(topic[1], topn=topn)
        third_sim = goog_w2v_model.most_similar(topic[2], topn=topn)
        fourth_sim = goog_w2v_model.most_similar(topic[3], topn=topn)
        fifth_sim = goog_w2v_model.most_similar(topic[4], topn=topn)

        extract_description_words = []
        all_sims = [first_sim, second_sim, third_sim, fourth_sim, fifth_sim]
        for sim in all_sims:
            for item in sim:
                word = item[0]
                if isAllLetters(word):
                    word_synonyms = wn_synonyms(word)
                    extract_description_words.append(word)
                    for synonym in word_synonyms:
                        extract_description_words.append(synonym)
        extraction_description_words_clean = Cleanse_Sim_Words(extract_description_words)
        sentence = ' '.join(extraction_description_words_clean)
        print(topic[0], 'description words', len(extraction_description_words_clean))
        print(sentence)
        Write_Descriptions_To_File(TOPIC_DESC_DIR + topic[0] + '.txt', sentence)

def Write_Descriptions_To_File(filepath, sentence):
    with open(filepath, 'w') as file:
        file.write(sentence)

def Cleanse_Sim_Words(sims):
    mod = []
    clean = []
    for word in sims:
        if '_' in word:
            words = word.replace('_', ' ')
            if isAllLetters(words.lower()):
                mod.append(words.lower())
        else:
            if isAllLetters(word.lower()):
                mod.append(word.lower())
    mod = f7(mod)
    return mod

def isAllLetters(word):
    letters = 'abcdefghijklmnopqrstuvwxyz '
    char_list = list(word)
    for c in char_list:
        if c not in letters:
            return False
    return True

def wn_synonyms(word):
    synonyms = []
    for ss in wordnet.synsets(word):
        synonym = [lemma for lemma in ss.lemma_names() if '_' not in lemma]
        for word_syn in synonym:
            if word_syn not in synonyms:
                synonyms.append(word_syn)
    return synonyms


def f7(seq):
    seen = set()
    seen_add = seen.add
    return [x for x in seq if not (x in seen or seen_add(x))]

def query(payload, API_URL, headers):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()

# https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2
def hf_sent_sim_mini(source_sentence):
    API_TOKEN = ''
    API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2"
    headers = {"Authorization": f"Bearer {API_TOKEN}"}
    output = query({
        "inputs": {
            "source_sentence": source_sentence,
            "sentences": [
                "select all rows where broker equals john",
                "count number of clients in canada",
                "combine two datasets based on client id"
            ]
        },
    }, API_URL, headers)
    print(output)


# https://huggingface.co/sentence-transformers/all-mpnet-base-v2
def hf_sent_sim(source_sentence):
    API_TOKEN = ''
    API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-mpnet-base-v2"
    headers = {"Authorization": f"Bearer {API_TOKEN}"}
    output = query({
        "inputs": {
            "source_sentence": source_sentence,
            "sentences": [
                "select all rows where broker equals john",
                "count number of clients in canada",
                "combine two datasets based on client id"
            ]
        },
    }, API_URL, headers)
    print(output)

def Read_Topic_Words():
    with open(MODELS_DIR + '/no overlapping words/manual removal of words/', 'r') as file:
        words = file.read()
        return words

def Overlapping_Words(extract, combine, update, reconcile):
    extract_words = extract.split(' ')
    combine_words = combine.split(' ')
    update_words = update.split(' ')
    reconcile_words = reconcile.split(' ')
    all_words = [extract_words, combine_words, update_words, reconcile_words]
    all_intersecting_words = []
    for i in range(len(all_words)):
        for j in range(i+1, 4):
            intersect = list(set(all_words[i]).intersection(set(all_words[j])))
            for word in intersect:
                all_intersecting_words.append(word)
    all_intersecting_words = list(set(all_intersecting_words))
    return all_intersecting_words

def Remove_Intersecting_Words(all_words, all_intersecting_words, outpath):
    file_count = 0
    for file in all_words:
        refined_words = []
        words = file.split(' ')
        print('WORDS')
        print(words)
        for word in words:
            if word not in all_intersecting_words:
                refined_words.append(word)
        refined_text = ' '.join(refined_words)
        if file_count == 0:
            filename = 'extract.txt'
        elif file_count == 1:
            filename = 'combine.txt'
        elif file_count == 2:
            filename = 'update.txt'
        elif file_count == 3:
            filename = 'reconcile.txt'
        Write_Descriptions_To_File(outpath + filename, refined_text)
        file_count += 1

def Remove_Overlapping_Words_From_All_Files():
    dir = TOPIC_DESC_DIR
    extract = Read_Topic_Words(dir + 'extract.txt')
    combine = Read_Topic_Words(dir + 'combine.txt')
    update = Read_Topic_Words(dir + 'update.txt')
    reconcile = Read_Topic_Words(dir + 'reconcile.txt')
    all_intersecting_words = Overlapping_Words(extract, combine, update, reconcile)
    all_words = [extract, combine, update, reconcile]
    Remove_Intersecting_Words(all_words, all_intersecting_words,
                              TOPIC_DESC_DIR + '/no overlapping words/')

def Build_Category_Word_Lists():
    #goog_w2v_model = Load_Gensim_Model()
    #source_sentence = gensim_word2vec(goog_w2v_model)
    dir = TOPIC_DESC_DIR + '/no overlapping words/manual removal of words/'
    extract = len(Read_Topic_Words(dir + 'extract.txt').split(' '))
    combine = len(Read_Topic_Words(dir + 'combine.txt').split(' '))
    update = len(Read_Topic_Words(dir + 'update.txt').split(' '))
    reconcile = len(Read_Topic_Words(dir + 'reconcile.txt').split(' '))
    print(extract)
    print(combine)
    print(update)
    print(reconcile)

def Parse_Word_File(filepath):
    with open(filepath, 'r') as f:
        word_str = f.read()
        words = word_str.split()
        return words

def Read_Category_Words():
    for file in os.listdir(TOPIC_DESC_DIR):
        if file == 'combine.txt':
            combine = ' '.join(Parse_Word_File(TOPIC_DESC_DIR + file))
        if file == 'extract.txt':
            extract = ' '.join(Parse_Word_File(TOPIC_DESC_DIR + file))
        if file == 'reconcile.txt':
            reconcile = ' '.join(Parse_Word_File(TOPIC_DESC_DIR + file))
        if file == 'update.txt':
            update = ' '.join(Parse_Word_File(TOPIC_DESC_DIR + file))
    return {'combine': combine, 'extract': extract, 'reconcile': reconcile, 'update':update}

def hf_sent_sim_classification_model(source_sentence, words_dic):
    API_TOKEN = ''
    #API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2"
    API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-mpnet-base-v2"
    headers = {"Authorization": f"Bearer {API_TOKEN}"}
    output = query({
        "inputs": {
            "source_sentence": source_sentence,
            "sentences": [
                words_dic['combine'],
                words_dic['extract'],
                words_dic['update'],
                words_dic['reconcile']
            ]
        },
    }, API_URL, headers)
    print('model output', output)
    result = Convert_Probs_2_Class(output, ['combine', 'extract', 'update', 'reconcile'])
    result = result[0].upper() + result[1:]
    return result

def Convert_Probs_2_Class(output, classes):
    max = -1
    for i in range(len(output)):
        if output[i] > max:
            result = classes[i]
            max = output[i]
    return result

def Load_Models():
    start = time.time()
    goog_w2v_model = Load_Gensim_Model_Quick()
    end = time.time()
    d = end - start
    print(f'google_w2v_model loaded in {d} seconds or {d * 1000} milliseconds')
    start = time.time()
    nlp = spacy.load(SPACY_EN_LG)
    end = time.time()
    d = end - start
    print(f'spaCy loaded in {d} seconds or {d * 1000} milliseconds')
    return goog_w2v_model, nlp

def Convert_Source_Sentence(source_sentence, goog_w2v_model, nlp):
    nltk.download('wordnet')
    doc = nlp(source_sentence)
    verbs = []
    all_related_words = []
    topn = 25
    for token in doc:
        if token.pos_ == 'VERB':
            try:
                similar_words = []
                sim_words = goog_w2v_model.most_similar(token.lemma_, topn=topn)
                for sim_word_item in sim_words:
                    sim_word = sim_word_item[0]
                    if isAllLetters(sim_word):
                        sim_word_synonyms = wn_synonyms(sim_word)
                        for synonym in sim_word_synonyms:
                            similar_words.append(synonym)
                for word_item in similar_words:
                    all_related_words.append(word_item)
            except Exception:
                print('There was a failure.')
                sys.exit(1)
    all_related_words = f7(all_related_words)
    all_related_str = ' '.join(all_related_words)
    return all_related_str

def Convert_Source_Sentence_Single_Word(source_sentence, goog_w2v_model, nlp):
    nltk.download('wordnet')
    doc = nlp(source_sentence)
    verbs = []
    all_related_words = []
    topn = 25
    for token in doc:
        if token.pos_ == 'VERB':
            try:
                similar_words = []
                all_related_words = token.text
                sim_word_synonyms = wn_synonyms(all_related_words)
                for synonym in sim_word_synonyms:
                    similar_words.append(synonym)
            except Exception:
                print('There was a failure converting Source Sentence to Single Word.')
                sys.exit(1)
    print('similar words')
    print(similar_words)
    all_related_str = ' '.join(similar_words)
    print('all related str', all_related_str)
    return all_related_str

def Remove_Stopwords(source_sentence):
    sentence_words = source_sentence.split()
    filtered_words = [word for word in sentence_words if word not in stopwords.words('english')]
    return filtered_words

def Remove_Punctiation(sentence):
    clean_sentence = ''
    clear = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ '
    for c in sentence:
        if c in clear:
            clean_sentence += c
    return clean_sentence


#if __name__=="__main__":
#    Build_Quick_Gensim_Model()

#    goog_w2v_model, nlp = Load_Models()
#    source_sentence = 'replace the old status in the monthly sales files with the new status inside master books'
#    all_related_str = Convert_Source_Sentence(source_sentence, goog_w2v_model, nlp)
#    words_dic = Read_Category_Words(TOPIC_DESC_DIR + '/no overlapping words/manual removal of words/')
#    hf_sent_sim_classification_model(all_related_str, words_dic)