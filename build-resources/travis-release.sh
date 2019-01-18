#!/bin/sh

#
#  This script will upload release versions to Maven Central and NPM.
#

cd java

# Prerun the script to download all the dependent artifacts
openssl aes-256-cbc -K $encrypted_816931f7ad0d_key -iv $encrypted_816931f7ad0d_iv -in ../build-resources/gpg_files.tar.enc -out ../build-resources/gpg_files.tar -d
tar -f ../build-resources/gpg_files.tar -xO gpg-secret-keys | $GPG_EXECUTABLE --import
tar -f ../build-resources/gpg_files.tar -xO gpg-ownertrust | $GPG_EXECUTABLE --import-ownertrust
mvn help:evaluate -Dexpression=project.version

current_pom_version=`mvn help:evaluate -Dexpression=project.version | grep -v '^\['`

if [[ "${current_pom_version}" == *SNAPSHOT ]]
then
    echo "Snapshot version detected.  Not deployed to Sonatype"
else
    echo "Release version ${current_pom_version} detected"

    # Capture any out-of-date dependencies to the log
    mvn versions:display-dependency-updates

fi

# Push to Sonatype/Maven Central and NPM
mvn -Prelease --settings ../build-resources/travis-settings.xml deploy
