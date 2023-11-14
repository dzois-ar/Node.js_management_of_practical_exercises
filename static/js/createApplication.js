
const validInputs = [
  'supervisor_id',
  'execution_certificate',
  'completion_report',
  'progress_report',
  'company_name',
  'duration',
  'employment',
  'start_date',
  'expiry_date'
]

const fileChange = {
  execution_certificateFileChange: false,
  completion_reportFileChange: false,
  progress_reportFileChange: false
}


const uploadForm = async function (finalized) {
  let formData = new FormData()
  const form = {
    'supervisor_id': document.getElementById('supervisor_idInput').value,
    'execution_certificate': document.getElementById('execution_certificateInput').files[0],
    'completion_report': document.getElementById('completion_reportInput').files[0],
    'progress_report': document.getElementById('progress_reportInput').files[0],
    'company_name': document.getElementById('company_nameInput').value,
    'duration': document.getElementById('durationInput').value,
    'employment': document.getElementById('employmentInput').value,
    'start_date': document.getElementById('start_dateInput').value,
    'expiry_date': document.getElementById('expiry_dateInput').value,
    'finalized': finalized
  }
  for (input in form)
    formData.append(input, form[input])

  $.ajax({
    method: 'POST',
    url: '/student/CreateApplication',
    data: formData,
    contentType: false,
    processData: false,
    success: function(data){
      location.assign('/student/StudentProfile')
    },
    error: function (error) {
      if (error.status === 400 && error.responseJSON?.errors !== undefined) {
        parseAndDisplayErrors(error.responseJSON.errors, validInputs)
      } else {
        console.error('Ajax upload error: ', error)
      }
    }
  })

}

const updateForm = async function (application_id, finalized) {
  let formData = new FormData()
  const form = {
    'application_id': application_id,
    'supervisor_id': document.getElementById('supervisor_idInput').value,
    'execution_certificate': document.getElementById('execution_certificateInput').files[0],
    'completion_report': document.getElementById('completion_reportInput').files[0],
    'progress_report': document.getElementById('progress_reportInput').files[0],
    'company_name': document.getElementById('company_nameInput').value,
    'duration': document.getElementById('durationInput').value,
    'finalized': finalized,
    'employment': document.getElementById('employmentInput').value,
    'start_date': document.getElementById('start_dateInput').value,
    'expiry_date': document.getElementById('expiry_dateInput').value,
    'execution_certificateFileChange': fileChange.execution_certificateFileChange,
    'completion_reportFileChange': fileChange.completion_reportFileChange,
    'progress_reportFileChange': fileChange.progress_reportFileChange,
  }
  for (input in form)
    formData.append(input, form[input])

  $.ajax({
    method: 'POST',
    url: '/student/UpdateApplication',
    data: formData,
    contentType: false,
    processData: false,
    success: function(){
      location.assign('/student/StudentProfile')
    },
    error: function (error) {
      if (error.status === 400 && error.responseJSON?.errors !== undefined) {
        parseAndDisplayErrors(error.responseJSON.errors, validInputs)
      } else {
        console.error('Ajax update error: ', error)
      }
    }
  })

}

document.getElementById('savedInput').addEventListener('change', async function () {
  if (this.value === "") {
    document.getElementById('execution_certificateHelp').setAttribute('hidden', '')
    document.getElementById('completion_reportHelp').setAttribute('hidden', '')
    document.getElementById('progress_reportHelp').setAttribute('hidden', '')
    fileChange.execution_certificateFileChange = false
    fileChange.completion_reportFileChange = false
    fileChange.progress_reportFileChange = false
    return
  }
  const application = await $.ajax(
    { method: 'GET', url: `/student/GetSavedApplication?application_id=${this.value}` }
  )
  document.getElementById('supervisor_idInput').value = application['supervisor_id']
  if (application['execution_certificate'] !== null) {
    document.getElementById('execution_certificateHelp').removeAttribute('hidden')
    fileChange.execution_certificateFileChange = true
  }
  else {
    document.getElementById('execution_certificateHelp').setAttribute('hidden', '')
    fileChange.execution_certificateFileChange = false
  }
  if (application['completion_report'] !== null) {
    document.getElementById('completion_reportHelp').removeAttribute('hidden')
    fileChange.completion_reportFileChange = true
  }
  else {
    document.getElementById('completion_reportHelp').setAttribute('hidden', '')
    fileChange.completion_reportFileChange = false
  }
  if (application['progress_report'] !== null) {
    document.getElementById('progress_reportHelp').removeAttribute('hidden')
    fileChange.progress_reportFileChange = true
  }
  else {
    document.getElementById('progress_reportHelp').setAttribute('hidden', '')
    fileChange.progress_reportFileChange = false
  }
  document.getElementById('company_nameInput').value = application['company_name']
  document.getElementById('durationInput').value = application['duration']
  document.getElementById('employmentInput').value = application['employment']
  document.getElementById('start_dateInput').value = application.start_date === null ? null : application['start_date'].split(':')[0].split('T')[0]
  document.getElementById('expiry_dateInput').value = application.expiry_date === null ? null : application['expiry_date'].split(':')[0].split('T')[0]
})

document.getElementById(`saveBtn`).addEventListener('click', () => {
  hideErrors()
  if (!(document.getElementById('savedInput').value === ""))
    updateForm(document.getElementById('savedInput').value, false)
  else
    uploadForm(false)
})

document.getElementById(`sendBtn`).addEventListener('click', () => {
  hideErrors()
  if (document.getElementById('savedInput').value === "") {
    uploadForm(finalized = true)
  } else {
    updateForm(document.getElementById('savedInput').value, true)
  }
})