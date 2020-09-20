function binarySearch(x,obj,key,callback)
{
	var l=0;
	var u=(obj.length)-1;
	var m=(l+u)/2;
	var mele;

	while(l<u)
	{
		m=(l+u)/2;
		mele=parseInt(obj[m][key]);

		if(mele==x)
			callback(true,m);
		else{
			if(mele<x)
			{
				l=m+1;
			}
			else{		
				u=m-1;			
			}
		}
	}

	callback(false,-1);
}

function find(index,regex,arraylist,callback)
{
	var x;
	var y;

	var flag=0;
	var res=[];

	if(arraylist)
	{
		for(x in arraylist)
		{
			y=arraylist[x];

			if(regex.test(y[index]))
			{
				res.push(y);
				flag=1;
			}
		}
	}
	
	if(flag==1)
	{
	/*	for (x in res)
		{
			console.log(res[x]);
		} */
		callback(false,res);
	}
	else
	{
		console.log("Record Not Found");
		callback(true,null);
	}

}


function findModified(obj,arraylist,callback) //obj is json obj with key as the column name and value as regex obj
{
	var x;
	var y;
	var z;

	var flag=0;
	var res=[];
	console.log("Utility : "+arraylist.length);
	console.log("Pattern : ");
	console.log(obj);
	if(arraylist)
	{
		for(x in arraylist)
		{
			y=arraylist[x];
			for(z in obj)
			{	
				regex=obj[z];
				index=z.toString();
				if(regex.test(y[index]))
				{
					res.push(y);
					flag=1;
					break;
				}
			}
		}
	}
	
	if(flag==1)
	{
	/*	for (x in res)
		{
			console.log(res[x]);
		} */
		callback(false,res);
	}
	else
	{
		console.log("Record Not Found");
		callback(true,null);
	}

}

function getPage(elePerPage,pageNumber,array,callback)
{
	elePerPage=parseInt(elePerPage);
	pageNumber=parseInt(pageNumber);
	var res=[];
	var err;
	var len=array.length;
	var totalPages=Math.ceil(len/elePerPage);
	var x;
	var startIndex=elePerPage*(pageNumber-1);

	if(pageNumber>totalPages)
	{
		callback(true,null);
	}
	if(pageNumber==totalPages)
	{
		var com=array.length%elePerPage;
		if(com!=0)
		{
			elePerPage=com;
		}
	}

	for(x=startIndex;x<(startIndex+elePerPage);x++)
	{
		res.push(array[x]);
	}

	callback(false,res);

}

function getPageSync(elePerPage,pageNumber,array)
{
	var res=[];
	var err;
	var len=array.length;
	var totalPages=Math.ceil(len/elePerPage);
	var x;
	var startIndex=elePerPage*(pageNumber-1);

	if(pageNumber>totalPages)
	{
		return null;
	}
	if(pageNumber==totalPages)
	{
		var com=array.length%elePerPage;
		if(com!=0)
		{
			elePerPage=com;
		}
	}
	for(x=startIndex;x<(startIndex+elePerPage);x++)
	{
		res.push(array[x]);
	}

	return res;

}


