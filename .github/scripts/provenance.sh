#!/bin/bash

set -e

echo Processing prerequisites ...
: ${SRP_CLIENT_ID:?} ${SRP_CLIENT_SECRET:?}

set -x

# Constants
SRP_HOME=/tmp/srp-tools

# Download the SRP CLI which we use to create source provenance
mkdir -p $SRP_HOME
wget --quiet --output-document $SRP_HOME/srp-cli-latest.tgz https://srp-cli.s3.amazonaws.com/srp-cli-latest.tgz
tar zxf $SRP_HOME/srp-cli-latest.tgz -C $SRP_HOME
chmod +x $SRP_HOME/srp
$SRP_HOME/srp --version

# Release Version
export BUILD_VERSION="$(cat lerna.json | jq -r .version)"

export GITHUB_REPOSITORY=${GITHUB_REPOSITORY/\//%2F}
export GITHUB_FQDN=$(echo "${GITHUB_SERVER_URL}" | sed -e "s/^https:\/\///")
export SRP_UID="uid.obj.build.github(instance='${GITHUB_FQDN}',namespace='${GITHUB_REPOSITORY}',ref='${GITHUB_REF}',action='${GITHUB_ACTION}',build_id='${GITHUB_RUN_ID}_${GITHUB_RUN_ATTEMPT}')"
export PROVENANCE_REVISION="$(date +%Y%m%d%H%M%S)"
export PROVENANCE_FRAGMENT_UID="uid.mtd.provenance_2_5.fragment(obj_uid=${SRP_UID:?},revision='${PROVENANCE_REVISION:?}')"

echo Generating source provenance
mkdir -p $PROVENANCE_REVISION

$SRP_HOME/srp provenance source \
    --scm-type git \
    --name "${GITHUB_REPOSITORY}" \
    --path ./ \
    --saveto $PROVENANCE_REVISION/source.json \
    --comp-uid "${SRP_UID:?}" \
    --build-number "${GITHUB_RUN_ID:?}_${GITHUB_RUN_ATTEMPT:?}" \
    --version "${BUILD_VERSION:?}" \
    --all-ephemeral true \
    --build-type release

set +x

echo Set Authentication Context
$SRP_HOME/srp config auth --client-id=${SRP_CLIENT_ID:?} --client-secret=${SRP_CLIENT_SECRET:?}

echo Submit provenance report
$SRP_HOME/srp metadata submit --url https://apigw.vmware.com/v1/s1/api/helix-beta --uid "${PROVENANCE_FRAGMENT_UID:?}" --path $PROVENANCE_REVISION/source.json
