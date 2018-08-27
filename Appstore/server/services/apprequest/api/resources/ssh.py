import os
import paramiko
import socket
from api.config import sshCredentials

#   Set of utility functions to connect to RaspBerryPI via SSH

#   Tries connection to device 
def SSHconnect(host, portNbr):
    try:
        ssh = paramiko.SSHClient()
        print ("1")
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        print ("2")
        print ("hostname = ", host)
        print ("port = ", portNbr)
        print ("sshUsername = ", sshCredentials.sshUsername)
        print ("sshPassword = ", sshCredentials.sshPassword)

        ssh.connect(hostname=host, port=portNbr, username=sshCredentials.sshUsername, password=sshCredentials.sshPassword)
        print ("3")
        ssh.get_transport().window_size = 3 * 1024 * 1024
        print ("4")
    except paramiko.AuthenticationException:
        print ("Authentication failed!")
        return -1, "Authentication failed!"
    except paramiko.BadHostKeyException:
        print ("SSH Exception!")
        return -1, "SSH Exception!"
    except paramiko.SSHException:
        print ("SSH Exception!")
        ssh.close()
        return -2, "SSH Exception!"
    except socket.error as e:
        print ("Socket error ", e)
        return -1, "Socket error ", e
    except:
        print ("Could not SSH to {}, unhandled exception".format(host))
        return -1, "Could not SSH to {}, unhandled exception".format(host)
    print ("Made connection to " + host + ":" + str(portNbr))
    return 0, ssh

#   Creates app directory in remote device
def createAppDirectory(ssh, appName):
    cmd = "mkdir -m 777 " + appName
    ssh.exec_command(cmd)

#   Sends file to remote PI device
def sendFile(ssh, source, target):
    try:
        sftp = ssh.open_sftp()
    except (paramiko.ssh_exception.SSHException, e):
        print ("SSH Exception on opening sftp connection\n", e)
    else:
        #====== now retrieve the remote file and place on desktop
        print ("Send" + source + "to" + target)
        sftp.put(source, target)
        sftp.close()

def installApp(ssh, apppackagePath, executableName):
    ssh.invoke_shell()
    homePath = os.path.join("/home", "dago")
    zipPath = os.path.join(apppackagePath, "App.zip")
    apppackagePath += "/"
    print(apppackagePath)
    cmdUnzip = "unzip {} -d {}".format(os.path.join(homePath, zipPath), os.path.join(homePath, apppackagePath))
    print(cmdUnzip)
    stdin, stdout, stderr = ssh.exec_command(cmdUnzip)
    executablePath = os.path.join(apppackagePath, "App", executableName)
    print(executablePath)
    cmdPyInstall = "pyinstaller --onefile {}".format(executablePath)
    exit_status = stdout.channel.recv_exit_status()
    if exit_status == 0:
        stdin, stdout, stderr = ssh.exec_command(cmdPyInstall)
    else:
        print(stderr.read())
        print("Error", exit_status)
    pydistPath = os.path.join(homePath, "dist", "helloworld")
    exit_status = stdout.channel.recv_exit_status()
    if exit_status == 0:
        stdin, stdout, stderr = ssh.exec_command("mv {} {}".format(pydistPath, os.path.join(homePath, apppackagePath)))
    else:
        print(stderr.read())
        print("Error", exit_status)
    print(stdout.read())