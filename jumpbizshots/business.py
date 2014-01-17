#!/usr/bin/python
#Reformated for Google App Engine
import webapp2
import os
import urllib2
import lxml.html as lh
import lxml.etree as le

class GetBusinessHandler(webapp2.RequestHandler):
  def handleError(e):
    print e

  def get(self):
    url = "http://www.economist.com/content/business-this-week"
    req = urllib2.Request(url, headers={'User-Agent' : "Magic Browser"}) 
    
    try:
      result = urllib2.urlopen(req)
      result = result.read().replace("\n", "")
      result = result.decode('utf-8', 'ignore')
      result = lh.fromstring(result)
      result = result.xpath("//div[@class='main-content']")
      #print(map(le.tostring,result))
      self.response.headers['Content-Type'] = 'text/html'
      self.response.write(map(le.tostring,result))
      
    except urllib2.URLError, e:
      handleError(e)

application = webapp2.WSGIApplication([
    ('/api/get/business', GetBusinessHandler),
], debug=True)