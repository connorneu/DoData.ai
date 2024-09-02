import requests
import os
from openai import OpenAI
from decouple import config
import subprocess
import paramiko
from .views import *


def apply_desc_algo_to_file(dataset, descriptiontext, username):
    file, sheet = parse_file_name_from_bracket_display(dataset)
    uid = clean_username(str(username))
    df = unmelt(file, sheet, uid)
    usr_dir = create_tmp_dir(uid)
    pa_ssh_dir = '/home/dodata/'
    user_csv_filename = uid + '.csv'
    py_filename = uid + '.csv'
    csv_filepath_local = os.path.join(usr_dir, user_csv_filename)
    csv_filepath_pa_ssh = os.path.join(pa_ssh_dir, user_csv_filename)
    py_filepath_local = os.path.join(usr_dir, py_filename)
    py_filepath_pa_ssh = os.path.join(pa_ssh_dir, py_filename)
    df.to_csv(csv_filepath_local)
    ssh_client = connect_ssh()
    ssh_upload_file(csv_filepath_local, csv_filepath_pa_ssh)
    gpt_code = generate_single_file_code(descriptiontext)
    save_gpt_code_to_py(py_filepath_local, gpt_code)
    ssh_upload_file(py_filepath_local, py_filepath_pa_ssh)
    ssh_execute_py()


def connect_ssh():
    password = config('SSH_PASSWORD')
    ssh_client = paramiko.SSHClient()
    ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh_client.connect(hostname='ssh.pythonanywhere.com', port=22, username='dodata', password=password)
    return ssh_client


def ssh_upload_file(ssh_client, localfilepath, remotefilepath):
    s = ssh_client.open_sftp()
    s.put(localfilepath, remotefilepath)


def generate_single_file_code(question):
    SECRET = config('GPT_SECRET')
    client = OpenAI(api_key=SECRET)
    question = f"""
                Write code in Python using the Pandas library to accomplish the question. 
                The output should be only code. When the code starts write xSTARTCODEx and when the code ends write xENDCODEx."
                The line of code to read the only file should be df = importfile.xlsx.
                Write the output as csv and call it outputfile.csv with index=False.
                The question: {question}.
                """

    stream = client.chat.completions.create(
        model="gpt-4-turbo-2024-04-09",
        messages=[{"role": "user", "content": question}],
        stream=True
    )
    response = ''
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            response += chunk.choices[0].delta.content
    print('response:')
    print(response)
    trim_response_start = ''.join(response.split("xSTARTCODEx")[1:])
    trim_response = trim_response_start.split("xENDCODEx")[0]
    print('trim response')
    print(trim_response)
    return trim_response


def save_gpt_code_to_py(gpt_code, local_save_py_path):
    with open(local_save_py_path, 'w+') as f:
        f.writelines(gpt_code)

def ssh_execute_py(ssh_client):
    cmd_to_execute = 'python daddy01.py'
    stdin, stdout, stderr = ssh_client.exec_command(cmd_to_execute)
    for line in stderr.readlines():
        print(line)