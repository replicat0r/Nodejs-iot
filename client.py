#!/usr/bin/python

import socket
import ssl
import thread
import time

action = None
brightness = 0

def inputter():
    global action
    global brightness

    while 1:
        user_input = raw_input('Choose an option:')
        print "You inputted:", user_input
        if user_input[0] == 'q':
            action = "q"
            print "Setting action to:", action
        else:
            brightness = int(user_input)
            action = "n"


print "The ssl version is:", ssl.OPENSSL_VERSION

# SET VARIABLES
msg = "{brightness:100}"
reply = ""
HOST, PORT = '52.32.7.51', 2000

# CREATE SOCKET
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.settimeout(10)

# WRAP SOCKET
#wrappedSocket = ssl.wrap_socket(sock, ssl_version=ssl.PROTOCOL_TLSv1_2)
wrappedSocket = ssl.wrap_socket(sock)

# CONNECT AND PRINT REPLY
wrappedSocket.connect((HOST, PORT))


thread.start_new_thread( inputter, () )

wrappedSocket.setblocking(0)

while 1:
    while action == None:
        time.sleep(0.5)
        try:
            received = wrappedSocket.recv(1280)
            print "Received:", received
        except:
            pass

    if action == "q":
        break
    elif action == "n":
        msg = '{"brightness":%d}' % brightness
        print "Sending:", msg
        wrappedSocket.send(msg)
        
    action = None


# CLOSE SOCKET CONNECTION
wrappedSocket.close()

