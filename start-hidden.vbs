Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
dir = fso.GetParentFolderName(WScript.ScriptFullName)
shell.Run "cmd /c """ & dir & "\start.bat""", 0, False
WScript.Sleep 3000
shell.Run "http://localhost:5173", 1, False
