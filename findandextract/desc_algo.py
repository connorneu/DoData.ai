from openai import OpenAI
from decouple import config

GUI = """
from tkinter import *
from tkinter import filedialog
from tkinter import ttk
import subprocess
import io
import sys

class RedirectConsole(io.StringIO):
    # Custom IO class to redirect stdout to Tkinter text widget.
    def __init__(self, widget):
        super().__init__()
        self.widget = widget

    def write(self, s):
        self.widget.insert(END, s)  # Insert text into widget
        self.widget.see(END)  # Scroll to the end

    def flush(self):
        pass


class Gui:
    def __init__(self, root, code, packages, user_desc):
        self.root = root
        self.gpt_code = code
        self.package_name_list = packages
        self.user_desc = user_desc

        # Setting the title
        root.title('doDatai.ai')

        # Setting the window size and centering it
        height = 400
        width = 530
        screenheight = root.winfo_screenheight()
        screenwidth = root.winfo_screenwidth()
        alignstr = '%dx%d+%d+%d' % (width, height, (screenwidth - width) / 2, (screenheight - height) / 2)
        root.geometry(alignstr)
        root.resizable(width=True, height=True)

        # Configure root grid
        root.grid_rowconfigure(0, weight=1)
        root.grid_columnconfigure(0, weight=1)

        # Create a Notebook for tabs
        tab_control = ttk.Notebook(root)
        tab_control.grid(row=0, column=0, sticky="nsew")

        # Tab 1 - App Tab
        app_tab = ttk.Frame(tab_control)
        tab_control.add(app_tab, text="App")
        self.create_app_tab(app_tab)

        # Tab 2 - Description Tab
        description_tab = ttk.Frame(tab_control)
        tab_control.add(description_tab, text="Description")
        self.create_description_tab(description_tab)

        # Tab 3 - Code Tab
        code_tab = ttk.Frame(tab_control)
        tab_control.add(code_tab, text="Code")
        self.create_code_tab(code_tab)

        # Configure tabs to expand and fill
        for tab in (app_tab, description_tab, code_tab):
            tab.grid_rowconfigure(0, weight=1)
            tab.grid_columnconfigure(0, weight=1)

    # Method to create the content in the App tab
    def create_app_tab(self, app_tab):
        # Main frame with padding for aesthetics
        main_frame = ttk.Frame(app_tab, padding=(20, 10))
        main_frame.grid(row=0, column=0, sticky="nsew")
        main_frame.grid_columnconfigure(0, weight=1)

        # Aesthetic styling for buttons
        style = ttk.Style()
        style.configure('TButton', font=('Ubuntu', 14), padding=6, background="#2b2b2b", foreground="#c4c2c2")
        style.map('TButton', background=[('active', 'grey')], foreground=[('active', 'black')])

        # Create a label with a modern look
        header_label = ttk.Label(main_frame, text="File Selector", font=('Ubuntu', 18, 'bold'))
        header_label.grid(row=0, column=0, pady=(0, 20), columnspan=2)

        # Adding the 'Select File' button with modern hover effects
        self.select_btn = ttk.Button(main_frame, text="Select File", command=self.openfile, style="TButton", )
        self.select_btn.grid(row=1, column=0, padx=10, pady=10, sticky="ew")

        # Textbox to display the filename
        self.filename_display = Text(main_frame, height=10, width=50, wrap='word', font=('Ubuntu', 10))
        self.filename_display.grid(row=2, column=0, padx=10, pady=0, sticky="ew")
        self.filename_display.insert(END, "Select file to begin...")
        self.filename_display.configure(state='disabled')  # Make it read-only
        sys.stdout = RedirectConsole(self.filename_display)

        # add progress bar
        self.progressbar = ttk.Progressbar()
        self.progressbar.grid(row=3, column=0, padx=10, pady=0, sticky="ew")

        # Footer text
        footer_label = ttk.Label(main_frame, text="doDatai.ai © 2024", font=('Ubuntu', 10, 'italic'), foreground="#888888")
        footer_label.grid(row=4, column=0, pady=(20, 0))

    # Method to create the content in the Description tab
    def create_description_tab(self, description_tab):
        # Text area for description
        description_text = Text(description_tab, wrap='word', font=('Ubuntu', 12))
        description_text.grid(row=0, column=0, padx=20, pady=20, sticky="nsew")
        description_text.insert(END, USER_DESC)
        description_text.configure(state='disabled')

    # Method to create the content in the Code tab
    def create_code_tab(self, code_tab):
        # Text area for code
        code_text = Text(code_tab, wrap='word', font=('DejaVu Sans Mono', 10))
        code_text.grid(row=0, column=0, padx=20, pady=20, sticky="nsew")
        code_text.insert(END, USER_CODE)
        code_text.configure(state='disabled')

    
    def create_ui(self):
        self.select = Button(self.root, command=self.openfile, bg="blue",fg="purple",cursor="hand2",text="Select File",font=("arial",18,"bold"),bd=0,activebackground="dark blue",activeforeground="orange")
        self.select.pack()


    def openfile(self):
        filename = filedialog.askopenfilename()
        self.filename_display.configure(state='normal') 
        self.filename_display.delete("1.0", END)
        self.filename_display.insert(END, 'File Selected:' + '\\n')
        self.filename_display.insert(END, '  ' + filename + '\\n')
        root.update()
        self.gpt_code = self.gpt_code.replace('FilePath.csv', filename)
        self.replace_filepath_in_code(filename)
        import_statements = self.generate_import_statements()
        print('Installing packages:')
        print('  ' + str(self.package_name_list))
        print('   (This can take several minutes)')
        root.update()
        self.structure_main_method(import_statements, self.package_name_list)
        self.progressbar.step(10)
        self.progressbar.step(50)


    def generate_import_statements(self):
        imprt_str = "subprocess.check_call([sys.executable, '-m', 'pip', 'install', '_PIPPACKAGE_', '-U'])"
        stmnts = []
        for package in self.package_name_list:
            s = imprt_str.replace('_PIPPACKAGE_', package)
            stmnts.append(s)
        return stmnts


    def replace_filepath_in_code(self, user_path):
        self.gpt_code = self.gpt_code.replace('FilePath.csv', user_path)


    def structure_main_method(self, import_statements, pkglst): 
        code = 'import subprocess\\n'
        code += 'import traceback\\n'
        code += 'def pip_install_subprocess():\\n'
        code += '\\timport sys\\n'
        p_c = 0
        for stmnt in import_statements:
            code += '\\ttry:\\n'
            code += '\\t\\t' + 'print(\\'  installing ' + str(pkglst[p_c]) + '...\\')\\n'
            p_c += 1
            code += '\\t\\troot.update()\\n'
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
        self.progressbar.step(30)
        exec(code)
        self.progressbar.step(110)
        print()
        print()
        print('Process Complete.')
        print()
        print('Result file created:')
        print("  doData_Output_File.csv") 
        print('  (same folder as this app)')
"""

MAIN_METHOD = """
if __name__ == "__main__":
    root = Tk()
    app = Gui(root, USER_CODE, PACKAGES, USER_DESC)
    root.mainloop()
"""

def gpt_client():
    SECRET =config('GPT_SECRET')
    Authorization: SECRET
    client = OpenAI(api_key=SECRET)
    return client


def gpt_question(client, user_desc, col_list):
    print('you are hjere')
    question = f"""
        You must ask one followup question based on the task below.
        Do not use any technical language in the followup question.
        The followup question you generate must make it easier to create Python code that will execute without errors when the user responds to your question.
        Do not ask what format the column is in!
        You always ask what format the column is in ignoring the very clear prompt. DO NOT ASK WHAT FORMAT THE COLUMN IS IN
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
    print('followup question response:')
    print(response)
    #strpd_response = response.split("XstartX")[1].split("XendX")[0]
    return response, question


def gpt_question_code(client, user_desc, col_list, orig_q, follow_q, follow_resp):
    question = f"""
        Write Python code to solve the following task. Output only code.
        The beginning of the code needs to start with "XstartX" and the end of the code should end with "XendX".
        Strip any ``` and don't write python anywhere.
        Use column headers from the provided Column_Name_List when needed in the code.
        The file path for the input file needs to be "FilePath.csv"
        The file path for the output file needs to be "doData_Output_File.csv".
        When reading input file, check if extension is csv, Excel, or txt. Allow all different types of Excel extension including xl, xlsx, xls, xlsm, xlsb, and ods.
        If the code involves numerical operations, convert the required columns to numeric data types.
        When converting columns to numeric data types first strip away all non-numeric characters so there are no errors during conversion (like 20% causing an error because it's a string).
        Read date column using to_datetime. Do not use format parameter.
        Never overwrite an existing column. If the column name is in use create a different column name.
        If the code requires a graph use a dark style with #6200ee as the color and make the axis labels visible and the output should be the graph.
        This code will only create 1 new file which is the "doData_Output_File.csv" file.
        The exception handling in this code will print a statement which explains the issue.
        If the code requires calculating the time difference between dates then express the result in the same units as the inputs. For example, calculate difference between january 1 2024 and january 4 2024 the result would be 3.
        Task: {user_desc}
        Column_Name_List: {col_list}
        The user has added these clarifications to your questions. Your questions:{follow_q}. User response:{follow_resp}.
                """
    stream = client.chat.completions.create(
        model="gpt-4o",
        #messages=[{"role": "user", "content": question}],
        messages=[{"role": "user", "content": orig_q}, {"role": "assistant", "content": follow_q}, {"role": "user", "content": question}],
        stream=True
    )
    response = ''
    for chunk in stream:
        if chunk.choices[0].delta.content is not None:
            # print(chunk.choices[0].delta.content, end="")
            response += chunk.choices[0].delta.content
    print('code response:')
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
            if '.' in line_words:
                line_words.split('.')[0]
            package = line_words[1].strip()
            packages.append(package)
    return packages


def get_dependant_packages(packages):
    for package in packages:
        if 'pandas' in package:
            packages.append('openpyxl')
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
    packages = get_dependant_packages(packages)
    print('packages:', packages)
    outfile = GUI + '\n' + 'USER_CODE=' + "\"\"\"" + '\n' + str(gpt_code) + '\n' + "\"\"\"" + '\n' + 'USER_DESC=' + "\"\"\"" + '\n' + str(user_desc) + '\n' + "\"\"\"" + '\n' + 'PACKAGES=' + str(packages) + '\n' +  MAIN_METHOD
    print('\n\n')
    print(outfile)
    return outfile







