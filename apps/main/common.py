import platform
from smb.SMBConnection import SMBConnection

class SMBCtl():
    def __init__(self, user, password, NetBIOS_name, remote_host, remote_port):
        self.user = user
        self.password = password
        self.NetBIOS_name = NetBIOS_name
        self.remote_host = remote_host
        self.remote_port = remote_port
        self.connection = SMBConnection(
            self.user, 
            self.password,
            'client_machine',
            self.NetBIOS_name,
            use_ntlm_v2=True
        )
        self.connection.connect(remote_host, remote_port, timeout=5)

    def file_list(self, share_name, directory):
        file_list = self.connection.listPath(share_name, directory)
        #print(f"Name: {file.filename}, Type: {'Directory' if file.isDirectory else 'File'}, Size: {file.file_size}")
        return list(map(lambda x: x.filename, file_list))
