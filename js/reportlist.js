var id;
var db;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    $('#reportListPage').live('pageshow', function (event) {
        id = getUrlVars()["id"];
        db = window.openDatabase("EmployeeDirectoryDB", "1.0", "PhoneGap Demo", 200000);
        db.transaction(getReportList, transaction_error);
    });
}

function transaction_error(tx, error) {
    alert("Database Error: " + error);
}

function getReportList(tx) {
	var sql = "select e.id, e.firstName, e.lastName, e.title, e.picture, count(r.id) reportCount " + 
		"from employee e left join employee r on r.managerId = e.id " +
		"where e.managerId=:id group by e.id order by e.lastName, e.firstName";
	tx.executeSql(sql, [id], getReportList_success);
}

function getReportList_success(tx, results) {
    var len = results.rows.length;
    for (var i=0; i<len; i++) {
    	var employee = results.rows.item(i);
		$('#reportList').append('<li><a href="employeedetails.html?id=' + employee.id + '">' +
			'<img src="pics/' + employee.picture + '" class="list-icon"/>' +
			'<h4>' + employee.firstName + ' ' + employee.lastName + '</h4>' +
			'<p>' + employee.title + '</p>' +
			'<span class="ui-li-count">' + employee.reportCount + '</span></a></li>');
		};
	$('#reportList').listview('refresh');
	db = null;
}
