
const supervisor_id = document.getElementById('supervisor_idHiddenInput').value

const getAbbreviatedApplications = async function () {
    try {
        return $.ajax({
            method: 'GET',
            url: `/supervisor/GetAbbreviatedApplications?supervisor_id=${supervisor_id}`
        })
    } catch (err) {
        console.error('GetAbbreviatedApplications query error:', err)
    }
}


const initTableStart = function (data) {
    const table = $('#applicationTable').DataTable({
        responsive: true,
        paging: true,
        language: {
            decimal: ",",
            thousands: ".",
            paginate: {
                next: '&#8594;', // or '→'
                previous: '&#8592;' // or '←'
            },
        },
        pageLength: 10,
        select: {
            style: 'single'
        },
        data,
        columns: [
            //empty colomn that the datatable uses for the expand row button with the class dtr-control
            { data: null, render: () => { return "" }, orderable: false },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return `
                    <button class="viewBtn waves-effect waves-dark btn btn-info btn-md btn-rounded w-100 m-1 p-2" id="ApplicationBtn${meta.row + 1}" value ="${data.application_id}">
                        Application #${meta.row + 1}
                    </button>`
                },
                "orderable": false
            },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return !(data.approval === null) ? '' : `
                    <button id="ReviewBtn${meta.row + 1}" class="reviewBtn waves-effect waves-dark btn btn-danger btn-md btn-rounded w-100 m-1 p-2" data-bs-toggle="modal" data-bs-target="#applicationReviewModal" value ="${data.application_id}">
                        Review
                     </button>`
                },
                "orderable": false
            },
            { data: 'first_name' },
            { data: 'last_name' },
            { data: 'email' },
            { data: 'company_name' },
            {
                data: 'create_date_ap', render: function (data, type, row) {
                    return moment(row.create_date_ap).format('MMMM Do YYYY, hh:mm:ss')
                }
            }

        ],
        order: [[3, 'asc']]
    })
    return table
}

const initTableButtons = function () {
    let reviewBtns = document.getElementsByClassName('reviewBtn')
    let viewBtns = document.getElementsByClassName('viewBtn')
    for (i = 0; i < reviewBtns.length; i++) {
        reviewBtns[i].addEventListener('click', function () {
            
            document.getElementById('reviewSubmitBtn').value = this.value
            document.getElementById('applicationReviewModalLabel').value = `Application Review${this.id.replace('ReviewBtn', '')}`
        })
    }

    for (i = 0; i < viewBtns.length; i++) {
        viewBtns[i].addEventListener('click', function () {
            $.ajax({
                method: 'GET',
                url: `/supervisor/GetApplication?application_id=${this.value}`,
                success: async (data) => {
                    if (data['approval'] === null) {
                        document.getElementById('reviewFromViewBtn').removeAttribute('hidden')
                        document.getElementById('reviewSubmitBtn').value = this.value
                    } else {
                        document.getElementById('reviewFromViewBtn').setAttribute('hidden', '')
                    }
                    for (const p of document.querySelectorAll('[id$=View]:not([id*=date])')) {
                        p.innerHTML = data[p.id.replace('View', '')]
                    }
                    document.getElementById('start_dateView').innerHTML = moment(data['start_dateView']).format('MMMM Do YYYY, hh:mm:ss')
                    document.getElementById('expiry_dateView').innerHTML = moment(data['expiry_dateView']).format('MMMM Do YYYY, hh:mm:ss')
                    document.getElementById('applicationViewModalLabel').innerHTML = `Application #${this.id.replace('ApplicationBtn', '')}`
                    document.getElementById('execution_certificateLink').href = `/GetPdf?path=..\\${data['execution_certificate']}`
                    document.getElementById('completion_reportLink').href = `/GetPdf?path=..\\${data['completion_report']}`
                    document.getElementById('progress_reportLink').href = `/GetPdf?path=..\\${data['progress_report']}`
                    Array('comments', 'grade', 'approval').forEach(
                        input => {
                            const element = document.getElementById(`${input}View`)
                            if (element.innerHTML === '') {
                                element.parentElement.setAttribute('hidden', '')
                                element.parentElement.previousElementSibling.classList.add('border-bottom-0')
                            }
                            else {
                                element.parentElement.removeAttribute('hidden')
                                element.parentElement.previousElementSibling.classList.remove('border-bottom-0')
                            }
                        }
                    )
                    new bootstrap.Modal(document.getElementById('applicationViewModal')).show()
                }
            })
        })
    }
}




const initTable = async function () {
    table = initTableStart(await getAbbreviatedApplications())
    initTableButtons()
}

initTable()