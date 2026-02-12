import platform
from smb.SMBConnection import SMBConnection
from smbclient import register_session
from smbprotocol.connection import Connection,Dialects
from smbprotocol.session import Session
from smbprotocol.tree import TreeConnect
from smbprotocol.open import (
        CreateDisposition,
        CreateOptions,
        DirectoryAccessMask,
        FileAttributes,
        FileInformationClass,
        FilePipePrinterAccessMask,
        ImpersonationLevel,
        Open,
        ShareAccess,
        )
from smbprotocol.file_info import FileInformationClass,FileDirectoryInformation
from smbprotocol.exceptions import SMBResponseException
import uuid

STATUS_NO_MORE_FILES = 0x80000006

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
            domain='cdb180',
            use_ntlm_v2=True,
        )
        self.connection.connect(remote_host, remote_port, timeout=5)

    def file_list(self, share_name, directory):
        file_list = self.connection.listPath(share_name, directory)
        #print(f"Name: {file.filename}, Type: {'Directory' if file.isDirectory else 'File'}, Size: {file.file_size}")
        return list(map(lambda x: x.filename, file_list))

class SMBProtocolCtl():
    def __init__(self, user, password, NetBIOS_name, remote_host, remote_port):
        self.user = user
        self.password = password
        self.NetBIOS_name = NetBIOS_name
        self.remote_host = remote_host
        self.remote_port = remote_port

        self.connection = Connection(
            uuid.uuid4(),
            self.remote_host,
            445
        )

        self.connection.connect(timeout=5)
        self.session = Session(
                connection=self.connection, 
                username=self.user,
                password=self.password
                )
        self.session.connect()

    def unix_to_smb_path(self, path: str) -> str:
        if path.startswith("/"):
            path = "" + path[1:]
        path = path.replace("/", "\\")
        if path.endswith("\\"):
            path = path[:-1]
        return path

    def file_list(self, share_name, directory):
        #file_list = self.connection.listPath(share_name, directory)
        tree = TreeConnect(session=self.session, share_name=f"\\\\{self.remote_host}\\{share_name}")
        tree.connect()
        dir_handle = Open(tree, self.unix_to_smb_path(directory))
        dir_handle.create(
                desired_access=0x00000001,
                file_attributes=FileAttributes.FILE_ATTRIBUTE_DIRECTORY,
                share_access=(
                    ShareAccess.FILE_SHARE_READ |
                    ShareAccess.FILE_SHARE_WRITE |
                    ShareAccess.FILE_SHARE_DELETE
                    ),
                create_disposition=CreateDisposition.FILE_OPEN,
                create_options=CreateOptions.FILE_DIRECTORY_FILE,
                impersonation_level=ImpersonationLevel.Impersonation,
                )

        files = []

        while True:
            try:
                entries = dir_handle.query_directory("*", 0x01)
            except SMBResponseException as e:
                if e.status == STATUS_NO_MORE_FILES:
                    break
                raise
            files = [*files, *entries]
        dir_handle.close()
        tree.disconnect()
        return list(map(lambda x: x["file_name"].get_value().decode("utf-16-le"), files))
