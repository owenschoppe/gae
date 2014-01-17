$(document).ready(function(){
    /*$.ajax({
      url: '/business.pl',
      success: function(data){
          //$('body').text(data);
          $business = $.parseHTML(data)[1];
          $('.secondary-header',$business).replaceWith("");
          $('.bottom-links',$business).replaceWith("");
          $('ul',$business).replaceWith("");
      
          console.log($business);
          $('body').html($business);
              $('body').prepend("<h1>Business This Week</h1>");
          },
      dataType: 'html'
      //test
      
      
    });*/
    $('body').append('<div id="controls" class="container">'+
        '<div class="row beta"><div class="col-sm-4"><em><small>beta</small></em></div></div>'+
        '<div class="row"><div class="col-sm-12"><h3>Business This Week for Print</h3></div></div>'+
        '<div class="row"><div class="col-sm-12"><button id="print-button" type="button" class="btn btn-primary print-btn" disabled="disabled">Print</button></div></div>'+
        '</div>');
    document.querySelector("#print-button").addEventListener("click",printHandler);
    $('#controls').append('<div class="hidden row well" id="formatControls"><div class="btn-group">'+
      '<button type="button" class="btn btn-default"><span class="glyphicon glyphicon-bold"></span></button>'+
      '<button type="button" class="btn btn-default"><span class="glyphicon glyphicon-italic"></span></button>'+
      '<div class="btn-group">'+
        '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">'+
          '<span class="glyphicon glyphicon-font"></span> <span class="caret"></span>'+
        '</button>'+
        '<ul class="dropdown-menu">'+
          '<li><a href="#">Serif</a></li>'+
          '<li><a href="#">Sans-Serif</a></li>'+
        '</ul>'+
      '</div>'+
      
    '</div>'+
    '<button type="button" class="btn btn-default"><span class="">Save</span></button>'+
    '<div>');
    $('body').append('<div id="viewport"><div id="btw"></div></div>');
    $('#btw').html('<div class="loading">Loading...</div>');
    $('body').append('<div id="flowedContent" class="btw"></div>');
    $('body').append('<div id="fixedContent" class="btw"></div>');
    $('#beta').affix({
        offset: {
          top: 40
        }
      })
    
    $.ajax({
      url: 'api/get/business',
      success: function(data){
            
            console.log('ajax data: ',data);
            /*
            var webArray = $.makeArray($.parseHTML(data.substr(1,data.length-1)));
            var attr = {className:['bottom-links','secondary-header'], nodeName:['UL']};
           var newArray = removeNode(webArray[0].children,attr);
            console.log('newArray',$(newArray).html());
            //$('#content.btw').html(newArray);
            
            renderBTW(stringifyHTML(newArray));
            */
            
            //$('body').html('<div id="bucket">'+$.parseHTML(data)+'</div>');
            data = data.substr(2,data.length-2);
            
            //TODO: abstract this function to take flow content into an arbitrary element.
            $('#flowedContent.btw').html($($.parseHTML(data)).html()); //inject the data into the flowedContent bucket. 
            $('flowedContent.btw').html($('#bucket').find('.main-content').html());
            //$('#bucket').remove();
            $('#flowedContent.btw').children().each(function(index){
               $(this).addClass('e-'+index); //add a unique class to all children so we can address them later.
               console.log('addClass',index);
            });
            
            //Add parameter classes to prevent breaking images and keeping titles with their paragraphs
            $('#flowedContent.btw').find('img').addClass('nowrap').parent().addClass('nowrap');
            $('#flowedContent.btw').find('.xhead').addClass('keepwithnext');
            
            $('.bottom-links').remove();
            $('.secondary-header').remove();
            $('.related-items').remove();
            $('p:empty').remove();
            $('a:contains("article")').each(function(){
                $(this).parent().text( $(this).parent().text().substr(0,$(this).parent().text().length-12) );
                //console.log($(this).parent().text().length);
                //$(this).remove();
            });
            //$('img').addClass('no-wrap');
            $('#fixedContent.btw').prepend('<div class="header col-span-2"><img src="http://media.economist.com/sites/all/themes/econfinal/images/svg/logo.svg" width="120px" /><h2>Business This Week</h2></div>');
            $('#fixedContent.btw').append('<div class="comments anchor-bottom-right">Feedback or suggestions? bizshots@jumpassociates.com</div>');
            //console.log($('body'));
            
            renderBTW($('#flowedContent').html(),$('#fixedContent').html());
          },
      dataType: 'html'
    });

});

function renderBTW(flow,fixed){
    var articleEl  = document.getElementById('btw');
    var viewportEl = document.getElementById('viewport');
    
    var cf = new FTColumnflow(articleEl, viewportEl, {
        columnCount: 2,
        standardiseLineHeight: true,
        pagePadding: [0,0], //w,h
        pageArrangement: 'vertical',
        noWrapOnTags: ['img', 'h3'],
        viewportWidth: 768,
        viewportHeight: 958,
        showGrid: false,
        debug: false
    });
    
    cf.flow(flow,fixed);
    //addButtons();
    attachTools();
    //formatControls();
    wrapInPage();
    
    //---Enable Printing---//
    document.querySelector("#print-button").disabled=false;
    
    //cf.flow($(newArray).html());
    
    //cf.flow('<p>One morning, when Gregor Samsa woke from troubled dreams</p>',
    //'<div class="col-span-2"><h1>The Metamorphosis</h1><h2>Franz Kafka, 1915</h2></div>');
    /*function addButtons(){
        $('.cf-column').find('*:not(em)').append('<button type="button" class="close hide">&times;</button>');
    }*/
    function wrapInPage(){
        $('.cf-render-area .cf-page').wrap('<div class="pageWrapper"></div>');
        $('.anchor-bottom-right').css({top: function(){
            console.log('column position',$('.cf-column-2').height(),$('.cf-column-2').position().top,$('.header').height());
            return $('.cf-column-2').height() + $('.cf-column-2').position().top - $('.header').height();
        }});
        //$(".xhead").removeAttr("style")
    }
    
     function formatControls(){
        $('.cf-column').find('*:not(em)').click(function(el){
            console.log('show formatControls');
            $('#formatControls').removeClass('hidden');
        });
    }
    
    
    function attachTools(){
    //add a close button to every subelement of viewport and make it visible on hover.
    $('.cf-column').find('*:not(em)').append('<button type="button" class="close hide">&times;</button>').hover(function(el){
    //$('.cf-column').find('*:not(em)').hover(function(el){
        var target = this;
        console.log('hover',el.currentTarget.tagName);
        el.stopPropagation(); //don't propagate to parent elements, we only want the inner most child.
        if(el.currentTarget.tagName === 'IMG'){ //since images can't have the close button as a child, bubble to the parent element.
            target = $(el.toElement).parent();
            console.log('parent of IMG',el);
        }
        $(target).find('.close').removeClass('hide'); //show the close button
        $(target).addClass('highlight'); //highlight the element
    },function(el){ //reset everything and bubble up to clear parent styles when navigating down
        $(this).find('.close').addClass('hide');
        console.log('unHover',el.toElement);
        $(this).removeClass('highlight').parents().removeClass('highlight');
    });
    
    //remove the parent node when the button is clicked
    $('.close').on('click',function(el){
        console.log('close!',el.target.parentNode.className);
        _gaq.push(["_trackEvent","Button","Close",el.target.parentNode.className]);
        $($(this).parent().attr('class').split(" ")).each(function(index,element){
            if(element.search('e-')>-1){
                console.log('found',element,'at',index);
                $('#flowedContent.btw').find('.'+element).remove();
                
                $('#btw').html('');
                cf.flow($('#flowedContent').html(),$('#fixedContent').html());
                //cf.reflow();
                attachTools(); //recusive call to reattach after reflow.
                wrapInPage();
                //formatControls();
            }
        });
        //$(el.toElement).parent('*').remove();
        //don't remove the elment. fade it and pass it's unique identifier to the remove node tool. then reflow.
    });
    
    }
}

function printHandler(a){
    printDocumentPage();
    _gaq.push(["_trackEvent","Button","Print"]);
    return false
}
function printDocumentPage(a){
    console.log("open print dialog");
    window.print();
    console.log("done printing");
    if(a){a()}
}

/*
function removeNode(arr,attr){
        //console.log('children:',children);
        for(var a in attr){
            for(var v=0; v<attr[a].length; v++){
                for(var n=arr.length-1; n>-1; n--){
            
                    //console.log(arr[n],attr[a],arr[n].hasOwnProperty(a));
                    if(arr[n].hasOwnProperty(a) && arr[n][a]!==null){
                        if(arr[n][a].indexOf(attr[a][v])>-1){
                            console.log("attr[a][v]",attr[a][v],"attr[a]",attr[a],"arr[n][a]",arr[n][a]);
                        //if(arr[n].a === attr.a){
                            arr = this.spliceNode(arr,n,1);
                            
                            //forms[1].parentNode.replaceChild(newDiv, forms[1]);
                            //console.log('parentNode',arr[n].parentNode);
                            //arr[n].parentNode.replaceChild("",arr[n]);
                            //console.log('this.tree[0]');
                        }
                    }
                }
            }
        }
        console.log(arr);
        return arr;
    }
    
    function spliceNode(arr,index,dur){
        var new_arr = [];
        for(var n=0; n<index; n++){
            new_arr.push(arr[n]);
        }
        for(var m=0; m+index+dur<arr.length; m++){
            new_arr.push(arr[m+index+dur]);
        }
        //console.log(new_arr,arr);
        return new_arr;
    }
    
    function stringifyHTML(arr){
        var string = '';
        for(var n=0; n<arr.length; n++){
            string += $(arr[n]).html();
        }
        return string;
        
    }
    */