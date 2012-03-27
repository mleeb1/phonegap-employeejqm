var id;
var db;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    $('#detailsPage').live('pageshow', function (event) {
        id = getUrlVars()["id"];
        console.log("opening database");
        db = window.openDatabase("EmployeeDirectoryDB", "1.0", "PhoneGap Demo", 200000);
        console.log("database opened");
        db.transaction(getEmployee, transaction_error);
    });
}

function transaction_error(tx, error) {
    alert("Database Error: " + error);
}

function getEmployee(tx) {
	var sql = "select e.id, e.firstName, e.lastName, e.managerId, e.title, e.department, e.city, e.officePhone, e.cellPhone, " +
				"e.email, e.picture, m.firstName managerFirstName, m.lastName managerLastName, count(r.id) reportCount " +
				"from employee e left join employee r on r.managerId = e.id left join employee m on e.managerId = m.id " +
				"where e.id=:id group by e.lastName order by e.lastName, e.firstName";
	tx.executeSql(sql, [id], getEmployee_success);
}

function getEmployee_success(tx, results) {
	var employee = results.rows.item(0);
	$('#employeePic').attr('src', 'pics/' + employee.picture);
	$('#fullName').text(employee.firstName + ' ' + employee.lastName);
	$('#employeeTitle').text(employee.title);
	$('#city').text(employee.city);
	console.log(employee.officePhone);
	if (employee.managerId>0) {
		$('#actionList').append('<li><a href="employeedetails.html?id=' + employee.managerId + '"><h3>View Manager</h3>' +
				'<p>' + employee.managerFirstName + ' ' + employee.managerLastName + '</p></a></li>');
	}
	if (employee.reportCount>0) {
		$('#actionList').append('<li><a href="reportlist.html?id=' + employee.id + '"><h3>View Direct Reports</h3>' +
				'<p>' + employee.reportCount + '</p></a></li>');
	}
	if (employee.email) {
		$('#actionList').append('<li><a href="mailto:' + employee.email + '"><h3>Email</h3>' +
				'<p>' + employee.email + '</p></a></li>');
	}
	if (employee.officePhone) {
		$('#actionList').append('<li><a href="tel:' + employee.officePhone + '"><h3>Call Office</h3>' +
				'<p>' + employee.officePhone + '</p></a></li>');
	}
	if (employee.cellPhone) {
		$('#actionList').append('<li><a href="tel:' + employee.cellPhone + '"><h3>Call Cell</h3>' +
				'<p>' + employee.cellPhone + '</p></a></li>');
		$('#actionList').append('<li><a href="sms:' + employee.cellPhone + '"><h3>SMS</h3>' +
				'<p>' + employee.cellPhone + '</p></a></li>');
	}
	$('#actionList').listview('refresh');
	db = null;
}
