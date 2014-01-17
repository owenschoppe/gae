#!/usr/bin/python
import os
import urllib2
import lxml.html as lh
import lxml.etree as le

print "Content-Type: text/html"
print

def handleError(e):
  print e

url = "http://www.economist.com/content/business-this-week"
req = urllib2.Request(url, headers={'User-Agent' : "Magic Browser"}) 

try:
  result = urllib2.urlopen(req)
  result = result.read().replace("\n", "")
  result = result.decode('utf-8', 'ignore')
  result = lh.fromstring(result)
  result = result.xpath("//div[@class='main-content']")
  print(map(le.tostring,result))

except urllib2.URLError, e:
  handleError(e)
