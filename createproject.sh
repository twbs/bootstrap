#!/usr/bin/env bash

#Generate a new project from your HTML5 Boilerplate repo clone
#Created 2010-10-13, Rick Waldron


##first run
# $ cd  html5-boilerplate/build
# $ sudo chmod a+x createproject.sh && ./createproject.sh

##usage
# $ cd  html5-boilerplate/build
# $ ./createproject.sh

while [[ -z $name ]]
do
    echo "To create a new html5-boilerplate project, enter a new directory name:"
    read name || exit
done

cd ..

webroot=$PWD

src=$webroot/html5-boilerplate
dst=$webroot/../$name

if [[ -d $dst ]]
then
    echo "$dst exists"
else
    #create new project
    mkdir "$name"

    #sucess message
    echo "Created Directory: $dst"
    
    cd "$src"
    
    #copy to new project directory
    #http://en.wikipedia.org/wiki/Cpio#Copy
    #http://cybertiggyr.com/cpio-howto/
    #http://www.cyberciti.biz/faq/how-do-i-use-cpio-command-under-linux/
    find . -depth -print0 | cpio -0pdmv "$dst"
    

    #sucess message
    echo "Created Project: $dst"
    
    # delete that temporary folder
    rm -r "$name"
    
    #move into new project
    cd "$dst"
    
    #in Bourne Again Shell, the cpio was copying 
    #the whole dir into the new project, along with the contents
    if [[ -d $dst/html5-boilerplate ]]
    then
         rm -r html5-boilerplate
    fi        
    
    if [[ -e $dst/createproject.sh ]]
    then
         rm -r createproject.sh
    fi  
    
    if [[ -e $dst/.git ]]
    then
         rm -rf .git
    fi


fi

