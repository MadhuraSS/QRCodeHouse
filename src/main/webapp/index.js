// index.js

var REST_DATA = 'api/todolist';
var REST_ENV = 'api/dbinfo';
var KEY_ENTER = 13;

function loadItems(){
	xhrGet(REST_DATA, function(data){
		document.getElementById("loading").innerHTML = "";
		var receivedItems = data.body || [];
		var items = [];
		var i;
		// Make sure the received items have correct format
		for(i = 0; i < receivedItems.length; ++i){
			var item = receivedItems[i];
			if(item && 'id' in item && 'name' in item){
				items.push(item);
			}
		}
		for(i = 0; i < items.length; ++i){
			addItem(items[i], false);
		}
	}, function(err){
		console.error(err);
		document.getElementById("loading").innerHTML = "ERROR";
	});
}

function addItem(item, isNew){
	var row = document.createElement('tr');
	var elText = document.getElementById("input_string_id");
	
	
	var id = item && item.id;
	if(id){
		row.setAttribute('data-id', id);
	}
	//row.innerHTML = "<td style='width:90%'><textarea onchange='saveChange(this)' onkeydown='onKey(event)'></textarea></td>" +
	//	"<td class='deleteBtn' onclick='deleteItem(this)' title='delete me'></td>";
	
	row.innerHTML = "<td style='width:90%'><textarea onclick='fetchQRCode(this)'></textarea></td>" +
		"<td class='deleteBtn' onclick='deleteItem(this)' title='delete this'></td>";
//onclick='makeCodeFromSelect(this)'


	if (elText.value) {

/*
		alert('row.childNodes[0]'+row.childNodes[0]);
		alert('row.childNodes[1]'+row.childNodes[1]);
		alert('row.childNodes[2]'+row.childNodes[2]);
		alert('row.childNodes[0].childNodes[0]'+row.childNodes[0].childNodes[0]);
		alert('row.childNodes[0].childNodes[1]'+row.childNodes[0].childNodes[1]);
	*/			
			row.innerHTML = "<td style='width:90%'><textarea  onclick='fetchQRCode(this)' onblur='saveChange(this)'>"+elText.value+"</textarea></td>" +
							"<td class='deleteBtn' onclick='deleteItem(this)' title='delete this'></td>";
		
			//var textarea=row.childNodes[0].childNodes[0];
			//textarea.readOnly=true;
			//textarea.addEventListener("focusout", saveChange(textarea));
		
			//saveChangeNew(textarea);
	}
		
	row.childNodes[0].childNodes[0].readOnly=true;	
	
	var table = document.getElementById('notes');
	console.log(table.lastChild);
	table.lastChild.appendChild(row);
	var textarea = row.firstChild.firstChild;
	if(item){
		textarea.value = item.name;
	}
	row.isNew = !item || isNew;
	textarea.focus();
}

function deleteItem(deleteBtnNode){
	var row = deleteBtnNode.parentNode;
	row.parentNode.removeChild(row);
	xhrDelete(REST_DATA + '?id=' + row.getAttribute('data-id'), function(){
	}, function(err){
		console.error(err);
	});
}

function deleteItemAll(){
	
		var table = document.getElementById("notes");
		
		//alert('table.rows.length='+table.rows.length);
		var noOfRows=table.rows.length;
		
		for(i = 0; i < noOfRows ; i++){
			
			//alert('i='+i);
			
			var row=table.rows[i];
						//alert('row no'+i+'='+row.value);
			var textarea=row.childNodes[0].childNodes[0];
			
			//alert('textarea'+i+'='+textarea.value);
			//deleteItem(textarea);


			//alert('dataid for'+i+'is'+row.getAttribute('data-id'));
			
			xhrDelete(REST_DATA + '?id=' + row.getAttribute('data-id'), function(){
			}, function(err){
				console.error(err);
			});
	
		}
		/*
		for(i = 0; i < noOfRows ; i++){
			
			var row=table.rows[i];
			alert('removing row'+i);
			row.parentNode.removeChild(row);
			noOfRows=noOfRows=table.rows.length;
			
		}*/
		
		while(table.rows.length > 0) {
  				table.deleteRow(0);
		}
		
		//table.innerHTML="";

}
		
		
		/*
		xhrGet(REST_DATA, function(data){
		document.getElementById("loading").innerHTML = "";
		var receivedItems = data.body || [];
		var items = [];
		var i;
		// Make sure the received items have correct format
		for(i = 0; i < receivedItems.length; ++i){
			var item = receivedItems[i];
			if(item && 'id' in item && 'name' in item){
				items.push(item);
			}
		}
		for(i = 0; i < items.length; ++i){
			
			alert('items['+i+']'+'='+items[i]);
			deleteItem(items[i]);
		}
	}, function(err){
		console.error(err);
		document.getElementById("loading").innerHTML = "ERROR";
	});
	*/


function onKey(evt){
	if(evt.keyCode == KEY_ENTER && !evt.shiftKey){
		evt.stopPropagation();
		evt.preventDefault();
		var row = evt.target.parentNode.parentNode;
		if(row.nextSibling){
			row.nextSibling.firstChild.firstChild.focus();
		}else{
			addItem();
		}
	}
}

function saveChange(contentNode, callback){
	var row = contentNode.parentNode.parentNode;
	var data = {
		name: contentNode.value
	};
	if(row.isNew){
		delete row.isNew;
		xhrPost(REST_DATA, data, function(item){
			row.setAttribute('data-id', item.id);
			callback && callback();
		}, function(err){
			console.error(err);
		});
	}else{
		data.id = row.getAttribute('data-id');
		xhrPut(REST_DATA, data, function(){
			console.log('updated: ', data);
		}, function(err){
			console.error(err);
		});
	}
}

function saveChangeNew(contentNode, callback){
	var row = contentNode.parentNode.parentNode;
	var data = {
		name: contentNode.value
	};
	//alert('data in saveChangeNew(): '+data);
	
	if(row.isNew){
		delete row.isNew;
		xhrPost(REST_DATA, data, function(item){
			row.setAttribute('data-id', item.id);
			callback && callback();
		}, function(err){
			console.error(err);
		});
	}else{
		data.id = row.getAttribute('data-id');
		xhrPut(REST_DATA, data, function(){
			console.log('updated: ', data);
		}, function(err){
			console.error(err);
		});
	}
}

function toggleServiceInfo(){
	var node = document.getElementById('dbserviceinfo');
	node.style.display = node.style.display == 'none' ? '' : 'none';
}

function updateServiceInfo(){
	xhrGet(REST_ENV, function(dbinfo){

				console.log(dbinfo);
				document.getElementById('envServiceName').innerHTML = dbinfo.name;
				document.getElementById('envDbName').innerHTML = dbinfo.db;
				document.getElementById('envHost').innerHTML = dbinfo.host;
				document.getElementById('envPort').innerHTML = dbinfo.port;
				document.getElementById('envUrl').innerHTML = dbinfo.jdbcurl;


	}, function(err){
		console.error(err);
	});
}

function fetchQRCode(stringTextArea) {
	document.getElementById('input_string_id').value = stringTextArea.value;
	generateQR();
	deleteItem(stringTextArea.parentNode);
}

function generateQR() {
	//	alert('generateQR() method');
	makeCode();
}

var qrcode = new QRCode(document.getElementById("qrcode"), {
	width : 100,
	height : 100
});

function makeCode () {
	//alert('makeCode() method');
	var elText = document.getElementById("input_string_id");
	
	if (!elText.value) {
		alert("Input a text");
		elText.focus();
		return;
	}
	
	qrcode.makeCode(elText.value);
	
	addItem();
}

/*function makeCodeFromSelect (node) {
	//alert('makeCode() method');
	var elText = document.getElementById("node");
	
	var row = contentNode.parentNode.parentNode;
	var data = {
		name: contentNode.value
	};
	
	
	
	if (!elText.value) {
		alert("Input a text");
		elText.focus();
		return;
	}
	
	qrcode.makeCode(elText.value);
	
	addItem();
}*/


updateServiceInfo();
loadItems();

