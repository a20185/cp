#!/bin/sh
#By Maxwell Ou
echo "Initialize folders for serving services"
sleep 3
echo ".
"

for i in `seq 9999`  
do  
    mkdir 1433$i 
done

sleep 1
echo "All Done."
