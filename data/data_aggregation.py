import csv


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

with open("data.csv") as f:
    reader = csv.reader(f)
    with open("temp.txt", "w") as fd:
        for row in reader:
            fd.write(row[3]+","+'"' + row[4]+'"' +","+ row[8] + "," + row[9] + "\n")