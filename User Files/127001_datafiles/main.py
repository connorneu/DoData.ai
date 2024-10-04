
from tkinter import *
from tkinter import filedialog
from tkinter import ttk
import subprocess
import io
import sys
import os

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
        head, tail = os.path.split(filename)
        self.filename_display.insert(END, 'File Selected: ' + tail + '\n')
        root.update()
        self.gpt_code = self.gpt_code.replace('FilePath.csv', filename)
        head, tail = os.path.split(filename)
        self.replace_filepath_in_code(filename, head)
        import_statements = self.generate_import_statements()
        print('Installing...')
        print('[...............................................] 0% Complete')
        root.update()
        self.structure_main_method(import_statements, self.package_name_list, self.filename_display)


    def generate_import_statements(self):
        imprt_str = "subprocess.check_call([sys.executable, '-m', 'pip', 'install', '_PIPPACKAGE_', '-U'])"
        stmnts = []
        for package in self.package_name_list:
            s = imprt_str.replace('_PIPPACKAGE_', package)
            stmnts.append(s)
        return stmnts


    def replace_filepath_in_code(self, user_path, new_dir):
        self.gpt_code = self.gpt_code.replace('FilePath.csv', user_path)
        outpath = os.path.join(new_dir, 'doData_Output_File.csv')
        self.gpt_code = self.gpt_code.replace('doData_Output_File.csv', outpath)


    def structure_main_method(self, import_statements, pkglst, display_box): 
        code = 'import subprocess\n'
        code += 'import traceback\n'
        code += 'def pip_install_subprocess():\n'
        code += '\timport sys\n'
        p_c = 0
        num_packages = len(pkglst)
        dot_per_pkg = int(48 / num_packages)
        hash_per_pkg = int(21 / num_packages)
        cur_hash_pos = 0
        for stmnt in import_statements:
            code += '\ttry:\n'
            p_c += 1
            code += '\t\t' + stmnt + '\n'
            prog_stmnt = '['
            for i in range(hash_per_pkg*p_c):
                prog_stmnt += '#'
                cur_hash_pos += 1
            for i in range(48-(dot_per_pkg*p_c)):
                prog_stmnt += '.'
            display_box.delete("end-2l","end-1l")
            print(prog_stmnt + '] ' + str(int((100/num_packages)*p_c)) + '% Complete')
            code += '\t\troot.update()\n'
            code += '\texcept:\n'
            code += '\t\tpass\n'
        code += '\n'
        code += 'def user_code():'
        for line in self.gpt_code.split('\n'):
            code += '\t' + line + '\n'
        code += '\n'
        code += 'if __name__ == "__main__\":\n'
        code += '\tpip_install_subprocess()\n'
        code += '	user_code()'
        exec(code)
        print()
        print()
        print('Process Complete.')
        print()
        print('Result file created:')
        print("  doData_Output_File.csv (in the same folder as this file)") 

USER_CODE="""

import pandas as pd

file_path = "FilePath.csv"

try:
    if file_path.endswith(".csv"):
        df = pd.read_csv(file_path)
    elif file_path.endswith((".xlsx", ".xls", ".xlsm", ".xlsb", ".ods")):
        df = pd.read_excel(file_path)
    elif file_path.endswith(".txt"):
        df = pd.read_table(file_path)
    else:
        raise ValueError("Unsupported file extension. Please use CSV, Excel, or TXT format.")

    # Since the task is not clear, I'm assuming a dummy process where we calculate some metric from column 'a'.
    # Convert column 'a' to a numeric data type after stripping non-numeric characters.
    df['a_numeric'] = pd.to_numeric(df['a'].replace(r'[^0-9.-]', '', regex=True), errors='coerce')

    # For demonstration, let's assume we sum up the values in 'a_numeric'
    a_sum = df['a_numeric'].sum()

    # Adding a new column or result from our computation
    df['a_sum'] = a_sum

    # Save the updated DataFrame to the output file
    df.to_csv("doData_Output_File.csv", index=False)

except Exception as e:
    print(f"An error occurred: {e}")

"""
USER_DESC="""
b
"""
PACKAGES=['pandas', 'openpyxl', 'xlrd']

if __name__ == "__main__":
    root = Tk()
    app = Gui(root, USER_CODE, PACKAGES, USER_DESC)
    root.mainloop()
