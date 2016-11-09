import csv
import requests
import json
import multiprocessing as mp
import itertools
# with open("data.csv", "w") as f:
#     writer = csv.writer(f)
#     files = [
#         "WordNetList1.xlsx - Sheet1.csv",
#         "WordNetList2.xlsx - Sheet1.csv",
#         "WordNetList3.xlsx - Sheet1.csv",
#         "WordNetList4.xlsx - Sheet1.csv"
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
# def dup(e, ids):

# 	count = ids.count(e["Database ID"])
# 	return count > 1

def addData(arg):
	url = arg["url"]#'http://marksmethod-mynameis7.rhcloud.com/api/wordnet/add'
	d = arg["data"]
	d.pop("", None)
	# print d["Database ID"], d["Synset"]
	return {"data": d, "url": url}
	#requests.post(url, json=d);
def sendPosts(arg):
	url = arg["url"]
	data = arg["data"]
	# print url
	requests.post(url, json=data)


if __name__ == "__main__":
	url = "http://marksmethod-mynameis7.rhcloud.com"
	url = "http://127.0.0.1:3000"
	print url
	headers = ("Semantic Field","Structure","Database ID","Synset","Phrase 1","Phrase 2","Definiton","Jpn ID","Jpn Synset","Phrase 1","Phrase 2","Jpn Definition")
	wordNet_headers = ("", "Semantic Field","Structure","Database ID","Synset","Phrase 1","Phrase 2","Definiton","Jpn ID","Jpn Synset","Phrase 1","Phrase 2","Jpn Definition")
	with open("data.csv") as f:
		reader = csv.reader(f);
		data = [dict(zip(wordNet_headers, row)) for row in reader]
		iterable = [{"url": url+"/api/wordnet/add", "data": d} for d in data]
		p = mp.Pool(12);
		final = p.map(addData, iterable)
		print len(final)
		done = p.map(sendPosts, final)
		# for d in data:
		# 	d.pop("", None)
		# 	# print d["Database ID"], d["Synset"]
		# 	requests.post(url + '/api/wordnet/add', json=d);
	# with open("mark_data.csv") as f:
	# 	reader = csv.DictReader(f);
	# 	for d in reader:
	# 		print d["Database ID"], d["Synset"], requests.post('http://marksmethod-mynameis7.rhcloud.com/api/phrases/add', json=d);
