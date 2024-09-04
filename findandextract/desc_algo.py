from openai import OpenAI
from decouple import config

GUI = """
from tkinter import *
from tkinter import filedialog
import subprocess


class Gui:
    def __init__(self, root, code, packages):
        self.root = root
        self.gpt_code = code
        self.package_name_list = packages
        # Setting the title
        root.title('doDatai.ai')
        # Setting the window size
        height = 720
        width = 1280
        screenheight = root.winfo_screenheight()
        screenwidth = root.winfo_screenwidth()
        alignstr = '%dx%d+%d+%d' % (width, height, (screenwidth - width)/2, (screenheight - height)/2)
        root.geometry(alignstr)
        root.resizable(width = False, height = False)
        self.create_ui()

    
    def create_ui(self):
        self.select = Button(self.root, command=self.openfile, bg="dark blue",fg="#dad122",cursor="hand2",text="Select File",font=("arial",18,"bold"),bd=0,activebackground="dark blue",activeforeground="#dad122")
        self.select.pack()


    def openfile(self):
        filename = filedialog.askopenfilename()
        self.gpt_code = self.gpt_code.replace('FilePath.csv', filename)
        self.replace_filepath_in_code(filename)
        import_statements = self.generate_import_statements()
        self.structure_main_method(import_statements)
        print(filename)


    def generate_import_statements(self):
        imprt_str = "subprocess.check_call([sys.executable, '-m', 'pip', 'install', '_PIPPACKAGE_', '-U'])"
        stmnts = []
        for package in self.package_name_list:
            s = imprt_str.replace('_PIPPACKAGE_', package)
            stmnts.append(s)
        return stmnts


    def replace_filepath_in_code(self, user_path):
        self.gpt_code = self.gpt_code.replace('FilePath.csv', user_path)


    def structure_main_method(self, import_statements): 
        code = 'import subprocess\\n'
        code += 'import traceback\\n'
        code += 'def pip_install_subprocess():\\n'
        code += '\\timport sys\\n'
        for stmnt in import_statements:
            code += '\\ttry:\\n'
            code += '\\t\\t' + stmnt + '\\n'
            code += '\\texcept:\\n'
            code += '\\t\\tpass\\n'
        code += '\\n'
        code += 'def user_code():'
        for line in self.gpt_code.split('\\n'):
            code += '\\t' + line + '\\n'
        code += '\\n'
        code += 'if __name__ == "__main__\\":\\n'
        code += '\\tpip_install_subprocess()\\n'
        code += '\tuser_code()'
        print("Final Code")
        print(code)
        exec(code)
"""

MAIN_METHOD = """
if __name__ == "__main__":
    root = Tk()
    app = Gui(root, USER_CODE, PACKAGES)
    root.mainloop()
"""

def gpt_client():
    SECRET =config('GPT_SECRET')
    Authorization: SECRET
    client = OpenAI(api_key=SECRET)
    return client


def gpt_question(client, user_desc, col_list):
    question = f"""
        Write Python code to solve the following task. Ask two follow up question to improve the accuracy of the code before generating the result.
        Format the response as "Please answer these questions to help ensure an accurate response:".
        After the user has answered the followup questions output only code.
        The beginning of the code needs to start with "XstartX" and the end of the code should end with "XendX".
        Use column headers from the provided Column_Name_List when needed in the code. Do not use usecols when reading the data.
        The file path for the input file needs to be "FilePath.csv"
        The file path for the output file needs to be "doData_Output_File.csv".
        When reading input file, check if extension is csv, Excel, or txt.
        Create exception handling to try reading excel files with the most different encoding types.
        Never overwrite an existing column. If the column name is in use create a different column name.
        This code should never alter any existing file. This code will only create 1 new file which is the "doData_Output_File.csv" file. If "doData_Output_File.csv" already exists throw an exception "There is already a file called doData_Output_File.csv in this location. Please choose another location".
        Task: {user_desc}
        Column_Name_List: {col_list}
                """

    stream = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": question}],
        stream=True
    )
    response = ''
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            # print(chunk.choices[0].delta.content, end="")
            response += chunk.choices[0].delta.content
    print('response:')
    print(response)
    #strpd_response = response.split("XstartX")[1].split("XendX")[0]
    return response, question


def gpt_question_code(client, user_desc, col_list, orig_q, follow_q, follow_resp):
    print("FOLLOW Questio")
    print(follow_q)
    print("REPSOSNE TO FOLLOW QUESTIOn")
    print(follow_resp)
    question = f"""
        Write Python code to solve the following task. Output only code.
        The beginning of the code needs to start with "XstartX" and the end of the code should end with "XendX".
        Use column headers from the provided Column_Name_List when needed in the code. Do not use usecols when reading the data.
        The file path for the input file needs to be "FilePath.csv"
        The file path for the output file needs to be "doData_Output_File.csv".
        When reading input file, check if extension is csv, Excel, or txt.
        Create exception handling to try reading excel files with the most different encoding types.
        Never overwrite an existing column. If the column name is in use create a different column name.
        This code should never alter any existing file. This code will only create 1 new file which is the "doData_Output_File.csv" file. If "doData_Output_File.csv" already exists throw an exception "There is already a file called doData_Output_File.csv in this location. Please choose another location".
        Task: {user_desc}
        Column_Name_List: {col_list}
        The user has added these clarifications to your questions. Your questions:{follow_q}. User response:{follow_resp}.
                """

    stream = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": orig_q}, {"role": "assistant", "content": follow_q}, {"role": "user", "content": question}],
        stream=True
    )
    response = ''
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            # print(chunk.choices[0].delta.content, end="")
            response += chunk.choices[0].delta.content
    print('response:')
    print(response)
    strpd_response = response.split("XstartX")[1].split("XendX")[0]
    return strpd_response


def gpt_convert_columns_to_list(client, col_list):
    question = f"""
        Convert this into a Python list:
        {col_list}
        Only output the Python list in this format ['a', 'b', 'c'].
        Put "xLx" before the list and "uLu" after the list.
        """

    stream = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": question}],
        stream=True
    )
    response = ''
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            response += chunk.choices[0].delta.content
    print('response column list:')
    print(response)
    parse_response = response.split('xLx')[1].split('uLu')[0]
    print('parse response')
    print(parse_response)
    return parse_response

def get_package_names(code):
    packages = []
    code_lines = code.split('\n')
    for line in code_lines:
        if line.startswith('import'):
            line_words = line.split()
            package = line_words[1].strip()
            packages.append(package)
    return packages


def get_dependant_packages(packages):
    for package in packages:
        if 'pandas' in package:
            packages.append('xlrd')
    return packages


def make_gpt_request(user_desc, col_heads):
    client = gpt_client()
    col_list = gpt_convert_columns_to_list(client, col_heads)
    gpt_code = gpt_question(client, user_desc, col_list)
    print('_Code_')
    print(gpt_code)
    return gpt_code


def make_gpt_request_code(user_desc, col_heads, orig_q, follow_q, follow_resp):
    client = gpt_client()
    col_list = gpt_convert_columns_to_list(client, col_heads)
    gpt_code = gpt_question_code(client, user_desc, col_list, orig_q, follow_q, follow_resp)
    print('_Code_')
    print(gpt_code)
    packages = get_package_names(gpt_code)
    print('packages:', packages)
    outfile = GUI + '\n' + 'USER_CODE=' + "\"\"\"" + '\n' + str(gpt_code) + '\n' + "\"\"\"" + '\n' + 'PACKAGES=' + str(packages) + '\n' + MAIN_METHOD
    print('\n\n')
    print(outfile)
    return outfile







