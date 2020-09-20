function validateNotNull(object)
{

 	var selector="#"+object.attr('id')+"-label";
   
	if(object.val()=="")
   	{
   	//	console.log("invalid");
   	
   		$('#status').val("false");

   		object.addClass("invalid");
   		object.attr("placeholder","Input Cannot be null");
    	$(selector).css("color","#b71c1c");

   	}
   	else
   	{
    		
    	$('#status').val("true");
    		
    	object.removeClass("invalid");
    
    
    	$(selector).css("color","#000000");

    }
}

function validateRange(object,min,max,option) //option - true if null is acceppted
{

  if(typeof option=="undefined")
  {
    option=false;
  }
  var selector="#"+object.attr('id')+"-label";
  var len=object.val().length;
  
  if(option&&len==0)
  {
      $('#status').val("true");
        
      object.removeClass("invalid");
    
     object.attr("placeholder","");
    
    
      $(selector).css("color","#000000");
      return true;
   
  } 
  if(!(len>=min&&len<=max))
    {
    //  console.log("invalid");
    
      $('#status').val("false");

      object.addClass("invalid");
      object.attr("placeholder","Input Not in Range");
      $(selector).css("color","#b71c1c");
      return false;
    }
    else
    {        
      
      $('#status').val("true");
        
      object.removeClass("invalid");
     
     object.attr("placeholder","");
   
      $(selector).css("color","#000000");
      return true;
    }
}

function basicValidateRange(len,min,max,option) //option - true if null is acceppted
{

  if(typeof option=="undefined")
  {
    option=false;
  }
  
  if(option&&len==0)
  {
      return true;
  } 
  if(!(len>=min&&len<=max))
    {
      return false;
    }
    else
    {          
      return true;
    }
}
