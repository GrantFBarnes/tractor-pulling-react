#!/usr/bin/env python3

import json
import os

output = open("populate.sql", "w")


def add_insert(table, columns, values):
    output.write("INSERT INTO " + table + " " +
                 columns + " VALUES " + values + ";\n")


def add_tractor(data):
    add_insert(
        "tractors",
        "(id, brand, model)",
        "(" +
        '"' + data["id"] + '"' + ", " +
        '"' + data["brand"] + '"' + ", " +
        '"' + data["model"] + '"' +
        ")"
    )


def add_puller(data):
    add_insert(
        "pullers",
        "(id, first_name, last_name)",
        "(" +
        '"' + data["id"] + '"' + ", " +
        '"' + data["first_name"] + '"' + ", " +
        '"' + data["last_name"] + '"' +
        ")"
    )


def add_location(data):
    add_insert(
        "locations",
        "(id, town, state)",
        "(" +
        '"' + data["id"] + '"' + ", " +
        '"' + data["town"] + '"' + ", " +
        '"' + data["state"] + '"' +
        ")"
    )


def add_season(data):
    add_insert(
        "seasons",
        "(id, year)",
        "(" +
        '"' + data["id"] + '"' + ", " +
        '"' + data["year"] + '"' +
        ")"
    )


def add_pull(data):
    add_insert(
        "pulls",
        "(id, season, location, date, youtube)",
        "(" +
        '"' + data["id"] + '"' + ", " +
        '"' + data["season"] + '"' + ", " +
        '"' + data["location"] + '"' + ", " +
        '"' + data["date"] + '"' + ", " +
        '"' + data["youtube"] + '"' +
        ")"
    )


def add_class(data):
    add_insert(
        "classes",
        "(id, pull, category, weight, speed)",
        "(" +
        '"' + data["id"] + '"' + ", " +
        '"' + data["pull"] + '"' + ", " +
        '"' + data["category"] + '"' + ", " +
        str(data["weight"]) + ", " +
        str(data["speed"]) +
        ")"
    )


def add_hook(data):
    add_insert(
        "hooks",
        "(id, class, puller, tractor, distance, position)",
        "(" +
        '"' + data["id"] + '"' + ", " +
        '"' + data["class"] + '"' + ", " +
        '"' + data["puller"] + '"' + ", " +
        '"' + data["tractor"] + '"' + ", " +
        str(data["distance"]) + ", " +
        str(data["position"]) +
        ")"
    )


def main():
    output.write("USE tractor_pulling;\n")

    data_dir = os.getcwd() + "/../data/"

    folders = {
        "Tractor": add_tractor,
        "Puller": add_puller,
        "Location": add_location,
        "Season": add_season,
        "Pull": add_pull,
        "Class": add_class,
        "Hook": add_hook,
    }

    for folder in folders:
        output.write("\n")
        folder_dir = data_dir + folder
        for file_name in os.listdir(folder_dir):
            with open(os.path.join(folder_dir, file_name), 'r') as f:
                folders[folder](json.loads(f.read()))

    output.close()


if __name__ == "__main__":
    main()
