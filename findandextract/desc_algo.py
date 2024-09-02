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
        imprt_str = "subprocess.check_call([sys.executable, '-m', 'pip', 'install', '_PIPPACKAGE_'])"
        stmnts = []
        for package in self.package_name_list:
            s = imprt_str.replace('_PIPPACKAGE_', package)
            stmnts.append(s)
        return stmnts


    def replace_filepath_in_code(self, user_path):
        self.gpt_code = self.gpt_code.replace('FilePath.csv', user_path)

        
    def structure_main_method(self, import_statements): 
        code = 'import subprocess'
        code += 'def pip_install_subprocess():\\n'
        for stmnt in import_statements:
            code += '\\t' + stmnt + '\\n'
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
        Write Python code to solve the following task. Output only code.
        The beginning of the code needs to start with "XstartX" and the end of the code should end with "XendX".
        Use column headers from the provided Column_Name_List when needed in the code.
        The file path for the input file needs to be "FilePath.csv"
        The file path for the output file needs to be "Output_File_Path.csv".
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

def make_gpt_request(user_desc, col_heads):
    client = gpt_client()
    col_list = gpt_convert_columns_to_list(client, col_heads)
    gpt_code = gpt_question(client, user_desc, col_list)
    print('_Code_')
    print(gpt_code)
    packages = get_package_names(gpt_code)
    print('packages:', packages)
    outfile = GUI + '\n' + 'USER_CODE=' + "\"\"\"" + '\n' + str(gpt_code) + '\n' + "\"\"\"" + '\n' + 'PACKAGES=' + str(packages) + '\n' + MAIN_METHOD
    print('\n\n')
    print(outfile)
    with open('/home/kman/Desktop/1.py', 'w+') as f:
        f.writelines(outfile)
    return outfile







