import csv
import requests
import json

# with open("data.csv", "w") as f:
#     writer = csv.writer(f)
#     files = [
#         "WordNetList1.xlsx - Sheet1.csv",
#         "WordNetList1.xlsx - Sheet1.csv",
#         "WordNetList1.xlsx - Sheet1.csv",
#         "WordNetList1.xlsx - Sheet1.csv"
#             ]
#     for file in files:
#         with open(file) as sheet1:
#             reader = csv.reader(sheet1)
#             for row in reader:
#                 writer.writerow(row)

# with open("data.csv") as f:
#     reader = csv.reader(f)
#     with open("temp.txt", "w") as fd:
#         for row in reader:
#             fd.write(row[3]+","+'"' + row[4]+'"' +","+ row[8] + "," + row[9] + "\n")

headers = ("Semantic Field","Structure","Database ID","Synset","Phrase 1","Phrase 2","Definiton","Jpn ID","Jpn Synset","Phrase 1","Phrase 2","Jpn Definition")
wordNet_headers = ("", "Semantic Field","Structure","Database ID","Synset","Phrase 1","Phrase 2","Definiton","Jpn ID","Jpn Synset","Phrase 1","Phrase 2","Jpn Definition")
# with open("data.csv") as f:
# 	reader = csv.reader(f);
# 	data = [dict(zip(wordNet_headers, row)) for row in reader]
# 	for d in data:
# 		d.pop("", None)
# 		print d["Database ID"], d["Synset"]
# 		requests.post('http://marksmethod-mynameis7.rhcloud.com/api/wordnet/add', json=d);
with open("mark_data.csv") as f:
	reader = csv.DictReader(f);
	for d in reader:
		print d["Database ID"], d["Synset"], requests.post('http://marksmethod-mynameis7.rhcloud.com/api/phrases/add', json=d);
		
