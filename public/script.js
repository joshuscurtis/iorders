const socket = io();
console.log("start")
socket.on('connect', function(data) {
	socket.emit('join', 'Hello World from client');
});
socket.on('broadcast', function(data) {
	console.log(data.description);
	if(data.description == true) audio.play();
});
socket.on('db', function(data) {
	//console.log(data.db);
	for(var i = 0; i < (data.db).length; i++) {
		sessionStorage.setItem(data.db[i].order_id, JSON.stringify(data.db[i]))
	}
});
var allOrders;
var option = 'table'
var view



function checkNew() {
	if(localStorage.getItem("newUser") === null) {
		window.newUserModal();
	}
}
setTimeout(function() {
	checkNew();
}, 1000)

function setCacheClosedOrder(id) {
	orderData = searchOrders(id)
	orderData.isclosed = true
	sessionStorage.setItem(id, JSON.stringify(orderData));
}

function getCacheClosedOrder(id) {
	orderData = JSON.parse(sessionStorage.getItem(id));
	if(orderData == null) return false
	return orderData.isclosed;
}

function setCacheProcessingOrder(id) {
	orderData = searchOrders(id)
	orderData.isprocessing = true
	sessionStorage.setItem(id, JSON.stringify(orderData));
}

function getCacheProcessingOrder(id) {
	orderData = JSON.parse(sessionStorage.getItem(id));
	if(orderData == null) return false
	return orderData.isprocessing;
}

function setCacheAssigneeOrder(id, assignee) {
	orderData = searchOrders(id)
	orderData.assignee = assignee;
	sessionStorage.setItem(id, JSON.stringify(orderData));
}

function getCacheAssigneeOrder(id) {
	orderData = JSON.parse(sessionStorage.getItem(id));
	if(orderData == null) return false
	return orderData.assignee;
}

function setToSplit() {
	view = "split"
	left = document.getElementById("content");
	right = document.getElementById("right");
	right.innerHTML = "<h3 class='text-center'>Table Orders</h3>"
	left.innerHTML = "<h3 class='text-center'>Takeaway Orders</h3>"
	left.setAttribute("style", "width:45%;margin-left:5%;position:absolute;left:0;")
	right.setAttribute("style", "width:45%;margin-right:5%;position:absolute;right:0;")
}

function unSplit() {
	view = "norm"
	left = document.getElementById("content");
	right = document.getElementById("right");
	left.setAttribute("style", "")
	right.setAttribute("style", "")
}

function checkOption() {
	try {
		var x = document.getElementById("mySelect").selectedIndex;
		return(document.getElementsByTagName("option")[x].value);
	}
	catch (error) {
		console.log(error)
		return 0;
	}

}

function checkSla() {
		var x = document.getElementById("sla")
		return(x.options[x.selectedIndex]).value;
}

function checkNum() {
	var x = document.getElementById("myNum")
	return(x.options[x.selectedIndex]).value;
}

function checkOrder() {
	var x = document.getElementById("myOrder")
	return(x.options[x.selectedIndex]).value;
}

function searchOrders(id) {
	orders = allOrders;
	for(var y = 0; y < orders.length; y++) {
		currentid = orders[y].order_id;
		if(currentid == id) {
			return orders[y]
		}
	}
	
	return dummy;
}

function newestOrder() {
	orders = allOrders;
	if(orders.length == null) return newestOrder()
	id = 0
	for(var y = 0; y < orders.length; y++) {
		currentid = orders[y].order_id;
		if(currentid > id) {
			id = currentid;
		}
	}
	return id
}

function isClosed(id) {
	return searchOrders(id).isclosed;
}

function isClosed2(id) {
	try {
		closed = searchOrders(id).isclosed;
	} catch(err) {
		closed = true;
	}
	return closed;
}

function isProcessing(id) {
	processing = getCacheProcessingOrder(id);
	if(searchOrders(id).isprocessing) return true;
	return false;
}

function isTable2(id) {
	return searchOrders(id).istable;
}

function isTable(id) {
	try {
		table = searchOrders(id).istable;
	} catch(err) {
		return true;
	} finally {
		return table;
	}
}
dom = 0

function isNew() {
	dom = document.getElementById(newestOrder() + 1)
}

function draw() {
	divId = searchOrders(newestOrder()).order_id;
	//if(isClosed(divId) == true){ divId = divId-1}
	if(document.getElementById(divId) == null && isClosed(divId) != true) {
		g = document.createElement('div');
		g.setAttribute("id", divId);
		document.getElementById("content").appendChild(g);
		document.getElementById(divId).innerHTML = (createOrderCardContent(searchOrders(newestOrder())))
		g.setAttribute("onclick", 'highlight(this);')
	}
}
var aId, barButton, kitButton;
function drawNth(x, table) {
	let divId = searchOrders(newestOrder()).order_id - x;
	let aId = divId
	
	if(document.getElementById(divId) != null && view != "split") document.getElementById(divId).remove();
	if(option == "split" && isTable == false) document.getElementById(divID).remove();
	// setOld(newestOrder()-x);
	//check if order is closed and is a table order
	dbOrCacheClosed = (isClosed(divId) || getCacheClosedOrder(divId));
	if(document.getElementById(divId) == null && (dbOrCacheClosed == false) && isTable(divId) == table) {
		//create div
		g = document.createElement('div');
		//set id and styling
		g.setAttribute("id", divId);
		g.setAttribute("style", "margin: 10px");
		g.setAttribute("class", "card text-white bg-success mb-3")
			//set card content
		isSplit = document.getElementById("content").getAttribute("style")
		target = "content"
		if(isSplit == "width:45%;margin-left:5%;position:absolute;left:0;") {
			if(table == true) target = "right"
			if(table == false) target = "content"
		}
		document.getElementById(target).appendChild(g);
		
		if(searchOrders(id).time == null) updatePG(id, "time", Date.now())
		
		document.getElementById(divId).innerHTML = (createOrderCardContent(searchOrders(divId)))
	
		g.setAttribute("onclick", 'highlight(this);')
			//highlight for processing 
		if(isProcessing(divId)) highlight2(g)
		
		// $('#b'+aId).click(function() {
		// 	event.stopPropagation();
		// 	updatePG(id, 'assignee2', false);
		// 	console.log('Order id: '+id+ " Bar");
		// });
		// $('#k'+aId).click(function() {
		// 	event.stopPropagation();
		// 	updatePG(id, 'assignee', false);
		// 	console.log('Order id: '+id+ " Kitchen");
		// })
		
		let barButton = document.getElementById('b'+aId)
		barButton.addEventListener('click', function(){
			event.stopPropagation();
   			updatePG(aId, 'assignee2', false);
			console.log('Order id: '+aId+ " Bar");
		});
		
		let kitButton = document.getElementById('k'+aId)
			kitButton.addEventListener('click', function(){
			event.stopPropagation();
   			updatePG(aId, 'assignee', false);
			console.log('Order id: '+aId+ " Kitchen");	
		});
		
		SLAHighlight(divId);
	}

}


function drawPastXTableOrders(x, order) {
	if(order == 'asc') {
		for(i = x; i >= 0; i--) {
			drawNth(i, true);
		}
	}
	if(order == 'desc') {
		for(i = 0; i <= x; i++) {
			drawNth(i, true);
		}
	}
}

function drawPastXTakeawayOrders(x, order) {
	if(order == 'desc') {
		for(i = 0; i <= x; i++) {
			drawNth(i, false);
		}
	}
	if(order == 'asc') {
		for(var i = x; i >= 0; i--) {
			drawNth(i, false)
		}
	}
}

function checkIfStillOpen(id) {
	closed = isClosed(id)
	if(closed) {
		document.getElementById(id).remove();
	}
}

function countOpen(num) {
	count = 0;
	for(i = 0; i <= num; i++) {
		thisOrder = searchOrders(newestOrder() - i)
		if((isClosed(newestOrder() - i) != true) && (isTable(newestOrder() - i))) {
			count = count + 1
		}
	}
	return count;
}

function countOpenTake(num) {
	count = 0;
	for(i = 0; i <= num; i++) {
		thisOrder = searchOrders(newestOrder() - i)
		if((isClosed(newestOrder() - i) != true) && (isTable(newestOrder() - i) == false)) {
			count = count + 1
		}
	}
	return count;
}

function highlight(el) {
	var element = el;
	id = element.getAttribute("id");
	//console.log("highlight"+id)
	if(searchOrders(id).isprocessing == true) {
		remove2(el)
	};
	element.setAttribute("class", 'card text-white bg-warning mb-3')
	processOrder(id)
}

function highlight2(el) {
	var element = el;
	id = element.getAttribute("id");
	//console.log("highlight"+id)
	if(element.getAttribute("class") == "card text-white bg-warning mb-3") {
		remove2(el)
	};
	element.setAttribute("class", 'card text-white bg-warning mb-3')
}

function remove2(el) {
	element = el;
	id = element.getAttribute("id");
	closeOrderModal(id)
}

function closeOrderModal(id) {
	Swal.fire({
		title: 'CONFRIM ORDER: ' + ((id % 99) + 1),
		text: "Click Yes, to confirm the order as complete",
		icon: 'success',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes, close order!'
	}).then((result) => {
		if(result.value) {
			//localStorage.removeItem(id);
			//localStorage.setItem("closed", id + "," + localStorage.getItem("closed"));
			closeOrder(id);
			setCacheClosedOrder(id);
			document.getElementById(id).remove();
		}
	});
}

function assignOrderModal(id, element) {
	Swal.fire({
		title: 'Confirm all bar/kitchen items are complete: ',
		text: "Select the area which is complete",
		icon: 'info',
		showCancelButton: true,
		cancelButtonText: 'Bar',
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Kitchen'
	}).then((result) => {
		if(result.value) {
			updatePG(id, 'assignee', false)
			assginOrder(id, "Kitchen")
		} else {
			assginOrder(id, "Bar")
			updatePG(id, 'assignee2', false)
		};
	});
}

function alertModal() {
	Swal.fire({
		title: 'Lots of open orders',
		text: "There are more than 7 open orders! ",
		icon: 'info',
		confirmButtonColor: '#3085d6',
		confirmButtonText: 'Ok'
	})
}

function remove(el) {
	var element = el;
	id = element.getAttribute("id");
	assignOrderModal(id, element)
}

function newUserModal() {
	Swal.fire({
		title: 'New User!',
		text: "Welcome to Orders App for The Way! If you have not used this before please speak to Rob/Steve/Sarah first.",
		icon: 'info',
		confirmButtonColor: '#3085d6',
		confirmButtonText: 'I Understand'
	}).then((result) => {
			localStorage.setItem("newUser", "false")
	});
}

function closeOrder(id) {
	document.getElementById(id).remove()
	updatePG(id, 'isclosed', true)
	updatePG(id, 'closetime', Date.now())
}

function updatePG(id, column, value) {
	var settings = {
		"url": "/update",
		"method": "POST",
		"timeout": 0,
		"headers": {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		"data": {
			"value": value,
			"id": id,
			"column": column
		}
	};
	$.ajax(settings).done(function(response) {}).fail(function(data) {
		console.log("fail ")
	});
}

function assginOrder(id, assignee) {
	document.getElementById('a' + id).innerHTML = assignee;
	updatePG(id, 'assignee', assignee)
}

function processOrder(id) {
	setCacheProcessingOrder(id);
	updatePG(id, 'isprocessing', true)
}
displayOrder = "asc"
numOfPastOrders = 20
slaTime = 3600;
option = "split"
var audio = new Audio('https://github.com/joshuscurtis/theway/raw/master/piece-of-cake.mp3');
setInterval(function() {
	if(openOrders > 7) alertModal();
}, 60000)

function refresh() {
	//console.log("R")
	getAllOrders();
	//option = checkOption();
	//numOfPastOrders = checkNum();
	//displayOrder = checkOrder();
	//slaTime = checkSla();
	setTimeout(refresh, 500);
}

function createTime(unixdate) {
	var date = new Date(unixdate*1);
	// Hours part from the timestamp
	var hours = date.getHours();
	// Minutes part from the timestamp
	var minutes = "0" + date.getMinutes();
	// Seconds part from the timestamp
	var seconds = "0" + date.getSeconds();
	// Will display time in 10:30:23 format
	var formattedTime = minutes.substr(-2) + ':' + seconds.substr(-2);
	
	return formattedTime;
}

function refresh2() {
	
	
	//console.log("r2")
	//if (searchOrders(newestOrder()).isnew == true) audio.play()
	content = document.getElementById("content");
	content.innerHTML = '';
	if(option == 'table') {
		unSplit()
		drawPastXTableOrders(numOfPastOrders, displayOrder)
		openOrders = countOpen(numOfPastOrders)
	};
	if(option == 'takeaway') {
		unSplit()
		drawPastXTakeawayOrders(numOfPastOrders, displayOrder);
		openOrders = countOpenTake(numOfPastOrders);
	}
	if(option == "split") {
		openOrders = countOpen(numOfPastOrders) + countOpenTake(numOfPastOrders);
		setToSplit()
		drawPastXTakeawayOrders(numOfPastOrders, displayOrder);
		drawPastXTableOrders(numOfPastOrders, displayOrder);
	}
	count = document.getElementById("count")
	count.innerHTML = "<strong col>Open Orders: " + (openOrders) + "</strong>"
	if(openOrders >= 5) count.setAttribute("style", "color: red;")
	if(openOrders <= 4) count.setAttribute("style", "color: orange;")
	if(openOrders <= 2) count.setAttribute("style", "color: green;")
	loader = document.getElementById('loader');
	if(loader != null) loader.remove();
	
	setTimeout(refresh2, 1000);
}
setTimeout(refresh, 1000);
setTimeout(refresh2, 5000);

function getAllOrders() {
	socket.on('db', function(data) {
		allOrders = data.db;
	});
}
//******************************************* 
function doesOrderContainTable(orderData) {
	var itemsInOrder = orderData.length;
	var count = -1;
	var tableCheck = null;
	var tableOrder;
	for(var y = 0; y < itemsInOrder; y++) {
		var orderName = orderData[y].name.substring(0, 5)
		if(orderName == "Table") {
			tableOrder = true;
			tableCheck = orderData[y].name;
			table = orderData[y].name;
			count = count + 1
		}
	}
	if(tableCheck == null) {
		tableOrder = false
	}
	return tableOrder;
}
var initCounter = 0;

function changeOrderStatus(status, id) {
	updatePG(id, 'isclosed', status)
}

function fetchDetails(id) {
	return JSON.parse(localStorage.getItem(id))
}

function getOrderDetails(id) {
	fetchDetails(id)
	details = fetchDetails(id)
	return details
}

function isOrderForTable(id) {
	return(JSON.parse(localStorage.getItem(id)).istable)
}

function isOrderClosed(id) {
	return(JSON.parse(localStorage.getItem(id)).isclosed)
}

function maxOrder() {
	lastId = 0;
	var settings = {
		"url": "/allOrders",
		"method": "GET",
		"timeout": 0,
		"headers": {
			"Prefer": "resolution=merge-duplicates",
			"Content-Type": "application/x-www-form-urlencoded"
		}
	};
	$.ajax(settings).done(function(response) {
		localStorage.setItem("allOrders", JSON.stringify(response));
	});
	data = JSON.parse(localStorage.getItem("allOrders"));
	for(var i = 0; i < data.length; i++) {
		if(data[i].order_id > lastId) {
			lastId = data[i].order_id
		}
	}
	return lastId;
}

function createOrderCard(id) {
	return(createOrderCardContent(localStorage.getItem(id)))
}

function SLAHighlight(id){
	thisOrder = searchOrders(id)
	orderTime = thisOrder.time;
	card = document.getElementById(id);
	
	if (Math.round(((Date.now() - orderTime)/1000)) > slaTime) {
		// if(thisOrder.isprocessing) {
		// 	setTimeout(function() {
		// 		card.setAttribute("class", "card text-white bg-warning mb-3");
		// 	}, 1000)
		// }
		currentClass = card.getAttribute("class")
		card.setAttribute("class", "flashit " +  currentClass);
	}
}

function createOrderCardContent(responseObj) {
	id = responseObj.order_id
	orderDetails = responseObj;
	orderData = orderDetails.products
	istable = orderDetails.istable;
	isclosed = orderDetails.isclosed;
	isnew = orderDetails.isnew;
	tableNum = 99; //TODO
	orderTime = orderDetails.time; 
	 
	
	SLAHighlight(id);
	for(var y = 0; y < orderData.length; y++) {
		if((orderData[y].name).substring(0, 5) == "Table") {
			tableNum = (orderData[y].name).substring(6, 10)
		}
	}
	if(istable == true) var html1 = " <h5> Table " + tableNum + " (Order: " + (id % 99 + 1) + ")</h5>";
	if(istable == false) var html1 = " <h5> Order: " + (id % 99 + 1) + "</h5>";
	var cardTop = '<div class="card text-center" style="background-color: inherit">' + html1 + '<div style="padding: 0;" class="card-body"><h5 class="card-title">'
	var cardMid = '</h5>'
	var cardEnd = '</div></div> ';
	var variantName = ""
	var html2 = "";
	
	//SLAHighlight(id);
	
	
	
	//loop through each item in a order
	for(var y = 0; y < orderData.length; y++) {
		if((orderData[y].name).substring(0, 5) != "Table") {
			if(orderData[y].variantName == null || orderData[y].variantName == "") {
				html2 = "<p>" + html2 + "<p>" + "<strong>" + orderData[y].name + "</strong> <br> Qty: <a id='qty'>" + orderData[y].quantity + ' </a> <br>'
			} else {
				variantName = "<br>" + orderData[y].variantName + "<br>"
				html2 = "<p>" + html2 + "<p>" + "<strong>" + orderData[y].name + "</strong><i>" + variantName + "</i> Qty: <i> <a id='qty'>" + orderData[y].quantity + '</a> </i> <br>'
			}
			if(orderData[y].comment != undefined) {
				html2 = "<p>" + html2 + "Comments:<i> " + orderData[y].comment + "</i><br> </p>";
			}
		}
	}
	if(orderDetails.assignee == null) var assignee = "danger";
	else assignee = orderDetails.assignee;
	assignee2 = orderDetails.assignee2;
	if(assignee2 == null) assignee2 = 'danger';
	if(assignee == 'true') {
		assignee = "danger"
	};
	if(assignee == 'false') {
		assignee = "success"
	};
	if(assignee2 == 'true') {
		assignee2 = "danger"
	};
	if(assignee2 == 'false') {
		assignee2 = "success"
	};
	result = ""
	if(assignee2 == 'success' && assignee == 'success') result = "Done"
	html2 = '<button onclick="event.stopPropagation();remove(this.parentNode.parentNode.parentNode)" style="position: absolute; top: 0px; right: 1px;" type="button" class="close" aria-label="Close"><span class="fa fa-cog" aria-hidden="true"></span></button>' + "<p>" + html2 + "<b id='a" + id + "' style='color:black;'> " + (result) + "</b><br> </p>";
	//add buttons
	html2 = html2 + '<button id="b' + id + '" type="button" style="position: absolute;bottom: 0px;right: 1px;max-width: 80px;width: 25%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" class="btn btn-' + assignee2 + '"><i class="fa fa-coffee" style="margin-right: 5px;" ></i> Bar</button>' + '<button  onclick="updatePG('+id+', "assignee", false);" id="k' + id + '" type="button" style="position: absolute;bottom: 0px;left: 1px;max-width: 80px;width: 25%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" class="btn btn-' + assignee + '"><i style="margin-right: 5px;" class="fa fa-cutlery"></i> Kitchen</button>'
	
		//generate final order card HTML
	buildHTML = cardTop + cardMid + html2 + createTime(Date.now() - orderTime) + cardEnd;
	html2 = "";
		//console.log(buildHTML);
		//document.getElementById(id).innerHTML = buildHTML;          
	return buildHTML;
	
}











//dummyjson
dummy = {
	"istable": true,
	"order_id": 0000,
	"products": [{
		"libraryProduct": true,
		"barcode": "",
		"variantUuid": "e16c7840-ba25-11ea-b2bf-478540e0bb7a",
		"autoGenerated": false,
		"quantity": "1",
		"productUuid": "e16b66d0-ba25-11ea-bd58-e0928794ceb0",
		"name": "Table 00",
		"id": "0",
		"type": "PRODUCT",
		"vatPercentage": 0,
		"unitPrice": 0,
		"description": "",
		"rowTaxableAmount": 0
	}, {
		"libraryProduct": true,
		"variantUuid": "28bd8b02-36c1-11ea-8227-e32937f459dc",
		"autoGenerated": false,
		"quantity": "999",
		"productUuid": "28bd8b00-36c1-11ea-8227-e32937f459dc",
		"name": "error",
		"id": "1",
		"type": "PRODUCT",
		"variantName": "error",
		"vatPercentage": 0,
		"unitPrice": 60,
		"costPrice": 36,
		"description": "",
		"rowTaxableAmount": 60
	}, {
		"libraryProduct": true,
		"barcode": "",
		"variantUuid": "78eb52c0-3c5b-11ea-91b7-f297517db5ec",
		"autoGenerated": false,
		"quantity": "1",
		"productUuid": "78ea8f70-3c5b-11ea-8585-0fa9cfe2507c",
		"name": "ERROR ERROR",
		"id": "2",
		"type": "PRODUCT",
		"vatPercentage": 0,
		"unitPrice": 200,
		"description": "",
		"rowTaxableAmount": 200
	}, {
		"libraryProduct": true,
		"barcode": "",
		"variantUuid": "e4fd4ac0-3f50-11ea-895f-51d045b6cde3",
		"autoGenerated": false,
		"quantity": "1",
		"productUuid": "e4fb4ef0-33f50-11ea-98d2-51be7ae620c7",
		"name": "ERROR",
		"id": "3",
		"type": "PRODUCT",
		"vatPercentage": 0,
		"unitPrice": 220,
		"description": "",
		"rowTaxableAmount": 220
	}],
	"isnew": true,
	"isclosed": true,
	"isprocessing": null,
	"assignee": "An ERROR has occured."
	}