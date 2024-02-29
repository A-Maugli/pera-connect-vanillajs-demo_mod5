
# Pera WalletConnect demo on Algorand Testnet

Environment: Node.js v20.9.0
```
npm install	# to install node_modules
```

## Scripts:
```
npm run start	# to pack files immediately, start web server
npm run build	# to build packed files, and after that start a web server
npm run clean	# to delete the files created by npm install, npm run start, npm run build
```
## Useful commands:
```
du -sh .	# disk usage, summary, human readable, for the current directory
hexdump -C fname # hex dump with characters a file 
```

## Issues during development

### Issue: 

error message after "npm run build", "Error: Expected content key c60a9ec6d268c542 to exist"

Solution: 

rm .parcel-cache and reexecute "npm run build"

### Issue:

npm run build	# parcel build, bundled files give reference error 

Solution:

add --no-scope-hoist

### Issue:

Uncaught (in promise) Error: Missing or invalid topic field

It happens when a WelletConnect session is deleted on the mobile.

Solution:

perawallet.connector is null in this case, so check its value.

## References:

Pera Connect, JavaScript SDK for integrating Pera Wallet to web applications, 
https://docs.perawallet.app/references/pera-connect 

@perawallet/connect, JavaScript SDK for integrating Pera Wallet to web applications, 
https://github.com/perawallet/connect/blob/main/README.md 

@perawallet/connect VanillaJS Demo, 
https://codesandbox.io/p/sandbox/perawallet-connect-vanillajs-demo-s5pjeo?file=%2Fsrc%2Findex.js 

Parcel, 
https://parceljs.org

Parcel documentation, 
https://parceljs.org/docs/

Uncaught ReferenceError after Parcel v2 build command #6711, 
https://github.com/parcel-bundler/parcel/issues/6711 # 

parceljs CLI, 
https://parceljs.org/features/cli/#parameters-specific-to-build

How-to Use ‘hexdump’,
https://ioflood.com/blog/hexdump-linux-command/#:~:text=The%20hexdump%20command%20in%20Linux%20is%20used%20to%20display%20the,%5Boption%5D%20%5Bfilename_or_string%5D%20.

How to Get the Size of a Directory in Linux, 
https://linuxize.com/post/how-get-size-of-file-directory-linux/

"Error: Expected content key de1e4a02ec63c4eb to exist", 
https://stackoverflow.com/questions/77166144/error-expected-content-key-de1e4a02ec63c4eb-to-exist-getting-this-error-in-reac

Optional chaining (?.),
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
