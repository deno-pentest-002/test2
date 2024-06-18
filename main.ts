#!/usr/bin/python

import sys
import os
import json
# import requests
import urllib
import argparse
import random
import string
import time
import gqlspection
from pathlib import Path

verbose = False

def set_verbose():
    global verbose
    verbose = True

def get_verbose():
    global verbose
    return verbose

def parse_args() -> (string, string, string, string, string, string):
    arg = argparse.ArgumentParser(description="GraphQL Fuzzer")
    arg.add_argument("--url", help="URL to GraphQL endpoint", required=True)
    arg.add_argument("--schema", help="json file", required=False)
    arg.add_argument("--proxy", help="Proxy to use", required=False)
    arg.add_argument("--headers", help="Headers to use", required=False)
    arg.add_argument("--verbose", help="Verbose output", required=False)
    arg.add_argument("--apikey", help="API key", required=False)

    a = arg.parse_args(args=None if sys.argv[1:] else ['--help'])

    if a.verbose:
        set_verbose()

    return a.url, a.schema, a.proxy, a.headers, a.verbose, a.apikey

# XXX: TODO 
def get_schema_from_url(url, proxy, headers, apikey) -> gqlspection.GQLSchema:
    raise Exception("get_schema_from_url not implemented")

def main():
    u, s, p, h,v, a = parse_args()
    if s:
        # convert graphql schema to introspection json 
        # https://transform.tools/graphql-to-introspection-json
        schema = gqlspection.GQLSchema(json = Path(s).read_text())
    else:
        schema = get_schema_from_url(u, p, h, a)

    idx = random.randint(0, len(schema.query.fields) - 1)


    q = schema.generate_query(schema.query.fields[idx].name)
    m = schema.generate_mutation(schema.query.fields[idx].name)

    req = q.str()

    req = "\n".join([line for line in req.split("\n") if "!!! MAX RECURSION DEPTH REACHED !!!" not in line])

    print(req)

if __name__ == "__main__":
    main()
