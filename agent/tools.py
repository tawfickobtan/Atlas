import json
import os
import subprocess
import time
from pathlib import Path

baseDir = Path(__file__).resolve().parent

forbidden = [
    "agent.py",
    "config.json",
    "llm.py",
    "README.md",
    "tools.json",
    "tools.py",
    ".gitignore",
    ".git",
    "system_prompt.txt",
    "requirements.txt"
]

# Load memory file
memory = {}
try:
    with open(os.path.join(baseDir, "..", "memory/memory.json"), "r", encoding="utf-8") as f:
        memory = json.load(f)
except Exception as e:
    memory = {}

def getItemsInPath(path: str) -> str:
    try:
        items = os.listdir(path)
        return "\n".join(items)
    except Exception as e:
        return "Error occured. " + str(e)
    
def getDirectoryTree(path: str, depth: int = 2) -> str:
    if depth > 5:
        return "Depth too large. Please choose a depth of 5 or less to avoid excessive output."
    tree = ""
    try:
        for root, dirs, files in os.walk(path):
            level = root.replace(path, "").count(os.sep)
            if level < depth:
                indent = " " * 4 * level
                tree += f"{indent}{os.path.basename(root)}/\n"
                subindent = " " * 4 * (level + 1)
                for f in files:
                    tree += f"{subindent}{f}\n"
        return tree if tree else "Directory is empty."
    except Exception as e:
        return "Error occured. " + str(e)

def createFile(file: str) -> str:
    if file in forbidden:
        return "You are not allowed to create these files."
    try:
        with open(file, "w", encoding="utf-8") as f:
            pass
        return "File created successfully."
    except Exception as e:
        return "Error occured: " + str(e)

def writeIntoFile(file: str, content: str) -> str:
    if file in forbidden:
        return "You are not allowed to modify these files."
    try:
        with open(file, "w", encoding="utf-8") as f:
            f.write(content)
        return "Wrote content into file successfully."
    except Exception as e:
        return "Error occured: " + str(e)
    
def readFile(file: str) -> str:
    try:
        with open(file, "r", encoding="utf-8") as f:
            output = f.read()
        return "content:\n" + output    
    except Exception as e:
        return "Error occured. " + str(e)

def readFileLines(file: str, start_line: int, end_line: int) -> str:
    """Reads specific lines from a file. Line numbers are 1-indexed."""
    try:
        with open(file, "r", encoding="utf-8") as f:
            lines = f.readlines()
        
        # Validate line numbers
        if start_line < 1 or end_line < 1:
            return "Error: Line numbers must be 1 or greater."
        if start_line > len(lines):
            return f"Error: File only has {len(lines)} lines, but you asked for line {start_line}."
        
        # Adjust to 0-indexed and clamp end_line
        start_idx = start_line - 1
        end_idx = min(end_line, len(lines))
        
        selected_lines = lines[start_idx:end_idx]
        content = "".join(selected_lines)
        
        return f"Lines {start_line}-{end_idx} of {file}:\n{content}"
    except Exception as e:
        return "Error occured: " + str(e)

def delete(file: str) -> str:  
    if file in forbidden:
        return "You are not allowed to delete these files."
    try:
        os.remove(file)
        return "File deleted successfully."
    except Exception as e:
        return "Error occured: " + str(e)

def createDirectory(directory: str) -> str:
    try:
        os.makedirs(directory, exist_ok=True)
        return "Directory created successfully."
    except Exception as e:
        return "Error occured: " + str(e)

def deleteDirectory(directory: str) -> str:
    if directory in forbidden:
        return "You are not allowed to delete these directories."
    try:
        os.rmdir(directory)
        return "Directory deleted successfully."
    except Exception as e:
        return "Error occured: " + str(e)

def moveFile(source: str, destination: str) -> str:
    if source in forbidden or destination in forbidden:
        return "You are not allowed to move these files."
    try:
        os.rename(source, destination)
        return "File moved successfully."
    except Exception as e:
        return "Error occured: " + str(e)
    
def moveMultipleFiles(sources: list, destination: str) -> str:
    if destination in forbidden:
        return "You are not allowed to move files to this destination."
    success = []
    failed = []
    for source in sources:
        if source in forbidden:
            failed.append(source)
            continue
        try:
            os.rename(source, os.path.join(destination, os.path.basename(source)))
            success.append(source)
        except Exception as e:
            failed.append(source)

    return "Successfully moved:" + "\n" +  '\n'.join(success) + "\n\n" + "Failed to move:" + "\n" + '\n'.join(failed) + "."

def copyFile(source: str, destination: str) -> str:
    if source in forbidden or destination in forbidden:
        return "You are not allowed to copy these files."
    try:
        import shutil
        shutil.copy2(source, destination)
        return "File copied successfully."
    except Exception as e:
        return "Error occured: " + str(e)
    
def copyMultipleFiles(sources: list, destination: str) -> str:
    if destination in forbidden:
        return "You are not allowed to copy files to this destination."
    success = []
    failed = []
    for source in sources:
        if source in forbidden:
            failed.append(source)
            continue
        try:
            import shutil
            shutil.copy2(source, os.path.join(destination, os.path.basename(source)))
            success.append(source)
        except Exception as e:
            failed.append(source)

    return "Successfully copied:" + "\n" +  '\n'.join(success) + "\n\n" + "Failed to copy:" + "\n" + '\n'.join(failed) + "."
    
def getCurrentDirectory() -> str:
    try:
        cwd = os.getcwd()
        return cwd
    except Exception as e:
        return "Error occured. " + str(e)

def fileExists(file: str) -> str:
    try:
        return ("Yes, " + file + " exists.") if os.path.exists(file) else ("No, " + file + " does not exist.")
    except Exception as e:
        return "Error occured: " + str(e)

def getFileSize(file: str) -> str:
    try:
        size = os.path.getsize(file)
        return f"Size of {file} is {size} bytes."
    except Exception as e:
        return "Error occured: " + str(e)

def renameFile(source: str, new_name: str) -> str:
    if source in forbidden or new_name in forbidden:
        return "You are not allowed to rename these files."
    try:
        os.rename(source, new_name)
        return "File renamed successfully."
    except Exception as e:
        return "Error occured: " + str(e)
    
# Tool functions for memory management 
    
def rememberFact(key: str, fact: str) -> str:
    memory[key] = fact
    try:
        with open(os.path.join(baseDir, "..", "memory/memory.json"), "w", encoding="utf-8") as f:
            json.dump(memory, f, indent=4)
        return "Fact remembered successfully."
    except Exception as e:
        return "Error occured: " + str(e)

def recallFact(key: str) -> str:
    try:
        fact = memory.get(key, "No fact found for the given key.")
        return fact
    except Exception as e:
        return "Error occured: " + str(e)

def forgetFact(key: str) -> str:
    try:
        if key in memory:
            del memory[key]
            with open(os.path.join(baseDir, "..", "memory/memory.json"), "w", encoding="utf-8") as f:
                json.dump(memory, f, indent=4)
            return "Fact forgotten successfully."
        else:
            return "No fact found for the given key."
    except Exception as e:
        return "Error occured: " + str(e)
    
def listMemories() -> str:
    try:
        if memory:
            facts = "\n".join([f"{k}: {v}" for k, v in memory.items()])
            return facts
        else:
            return "No memories stored."
    except Exception as e:
        return "Error occured: " + str(e)

    

