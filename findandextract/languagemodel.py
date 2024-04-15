import traceback
import nltk
import requests
from nltk.corpus import wordnet
from gensim import models
from gensim.test.utils import datapath
import os
from nltk.corpus import stopwords
import spacy
import time
import sys
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from transformers import pipeline
from openai import OpenAI

SETTINGS_DIR = os.path.dirname(__file__)
print('settings', SETTINGS_DIR)
PROJECT_ROOT = os.path.abspath(os.path.dirname(SETTINGS_DIR))
print('root', PROJECT_ROOT)
MODELS_DIR = os.path.join(SETTINGS_DIR, 'static/models/')
print('models dir', MODELS_DIR)


GOOGLE_NEG_300 = MODELS_DIR + 'GoogleNews-vectors-negative300.bin'
GOOGLE_NEG_300_Q = MODELS_DIR + 'google_news_neg300_q'
TOPIC_DESC_DIR = MODELS_DIR + '/Topic Descriptions/'
SPACY_EN_LG = "/home/kman/VS_Code/datamanipulator/dodata-venv/lib/python3.10/site-packages/en_core_web_lg/en_core_web_lg-3.7.0"


def Parse_User_Formula(df, user_text, new_col_name):
    response = gpt(user_text)
    formula, col_map_list = parse_response(response)
    revised_col_map_list = find_real_file_col_mapping(df, col_map_list)
    new_formula = update_formula_columns(formula, revised_col_map_list)
    add_formula(df, new_formula, new_col_name)


def add_formula(df, new_formula, new_col):
    df[new_col] = new_formula


def update_formula_columns(formula, revised_col_map_list):
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
                    #print('match found from:', i, str(i + len(old_col)))
                    formula_l = list(formula)
                    #print('orig')
                    #print(formula_l)
                    #print('I:', i, 'lenolccol:', len(old_col), i+len(old_col))
                    for p in range(len(old_col)):
                        formula_l.pop(i)
                        #print('popd')
                        #print(formula_l)
                    new_col_idx = 0
                    for ins in range(i, i + len(new_col)):
                        formula_l.insert(ins, new_col[new_col_idx])
                        new_col_idx += 1
                    #print('instr')
                    #print(formula_l)
                    formula = ''.join(formula_l)
                    #print(i)

            i += 1
    print('revised formula:', formula)
    return formula


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
        print('revised_col_map_list:')
        print(revised_col_map_list)
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


def parse_response(response):
    formula_r = response.split('[Delimiter]')[0]
    col_maps_r = response.split('[Delimiter]')[1]
    formula = formula_r.replace('Formula:', '').rstrip().strip()
    if formula[0] == '\'' or formula[0] == '"' or formula[0] == '`':
        formula = formula[1:]
    if formula[-1] == '\'' or formula[-1] == '"' or formula[-1] == '`':
        formula = formula[:-1]
    print("FORMULA:", formula)
    col_maps_list = []
    col_maps = col_maps_r.replace('Column mapping:', '').rstrip().strip()
    col_maps_split = col_maps.split(',')
    for map in col_maps_split:
        #print('map', map)
        split_char = '='
        if ':' in map:
            split_char = ':'
        elif '=' in map:
            split_char = '='
        elif '->' in map:
            split_char = '->'
        elif '=>' in map:
            split_char = '=>'
        key = map.split(split_char)[0].rstrip().strip()
        val = map.split(split_char)[1].rstrip().strip()
        col_maps_list.append((key, val))
    print("COL MAPPING:")
    print(col_maps_list)
    return formula, col_maps_list


def gpt(user_text):
    SECRET = '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'
    # Authorization: SECRET
    client = OpenAI(api_key=SECRET)

    question = f"""
                Generate an excel formula based on below Question.
                Question: {user_text}. 
                Do not put ` anywhere.
                The column names should match Excel column convention ie. A, B, C etc.
                Format the response exactly as below without additional text:
                Formula: only the excel formula based on below question. Use column letters to define columns just like in an Excel formula. The formula should be on one line.
                [Delimiter]
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
    result_desc = {'combine': 'Join two datasets on either rows or column headers to combine the values into one file.',
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
    API_TOKEN = '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'
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
    API_TOKEN = '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'
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
    API_TOKEN = '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'
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