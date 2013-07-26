#!/bin/bash -x

# All the .PWX files are stored in the WATCHFOLDER. Before the app server starts
# they are copied to the DATA FOLDER. In addition, the app server watches the 
# WATCHFOLDER for new .pwx and copies them into the DATAFOLDER when it finds a new one.
export WATCHFOLDER="/Users/sdaas/Dropbox/Apps/WahooFitness"
export DATAFOLDER="./data"

# Copy all the PWX files from the drop box to the data folder
find ${WATCHFOLDER} -name "*.pwx" -exec cp {} ${DATAFOLDER} \;

# Start the Server
# The app server will keep monitoring the dropbox for new files
node app.js
