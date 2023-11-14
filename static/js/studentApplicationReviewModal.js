const initTableButtons = function () {
    let viewBtns = document.getElementsByClassName('viewBtns');
    let applicationBtns = document.getElementsByClassName('applicationBtns');
    let rejectBtns = document.getElementsByClassName('rejectBtns');
    let deleteApplication = document.getElementsByClassName('deleteApplicationBtns');

    for (i = 0; i < viewBtns.length; i++) {
        
        viewBtns[i].addEventListener('click', function () {

            $.ajax({
                method: 'GET',
                url: `/student/GetReviews?application_id=${this.value}`,
                success: async (data) => {
                    console.dir(data);
                    if(data['approval'] === null){
                        document.getElementById('reviewFromViewBtn').removeAttribute('hidden');
                        document.getElementById('reviewSubmitBtn').value = this.value;
                    }else{
                        document.getElementById('reviewFromViewBtn').setAttribute('hidden','');
                    }
                    for(const p of document.querySelectorAll('[id$=View]:not([id*=date])')){
                        p.innerHTML = data[p.id.replace('View','')];
                    }
                    document.getElementById('commentsView').innerHTML = data['comments'];
                    document.getElementById('start_dateView').innerHTML = moment(data['start_dateView']).format('MMMM Do YYYY, hh:mm:ss'); 
                    document.getElementById('expiry_dateView').innerHTML = moment(data['expiry_dateView']).format('MMMM Do YYYY, hh:mm:ss'); 
                    document.getElementById('applicationViewModalLabel').innerHTML = `Application #${this.id.replace('ApplicationBtn','')}`;
                    document.getElementById('execution_certificateLink').removeAttribute('hidden');
                    document.getElementById('execution_certificateLink').href = `/GetPdf?path=..\\${data['execution_certificate']}`;
                    document.getElementById('completion_reportLink').removeAttribute('hidden');
                    document.getElementById('completion_reportLink').href = `/GetPdf?path=..\\${data['completion_report']}`;
                    document.getElementById('progress_reportLink').removeAttribute('hidden');
                    document.getElementById('progress_reportLink').href = `/GetPdf?path=..\\${data['progress_report']}`;
                    new bootstrap.Modal(document.getElementById('applicationViewModal')).show();
                },
            })
        })
    }


    for (i = 0; i < applicationBtns.length; i++) {

        applicationBtns[i].addEventListener('click', function () {
               
            $.ajax({
                method: 'GET',
                url: `/student/GetApplication?application_id=${this.value}`,
                success: async (data) => {
                    console.dir(data);
                    if(data['approval'] === null){
                        document.getElementById('reviewFromViewBtn').removeAttribute('hidden')
                        document.getElementById('reviewSubmitBtn').value = this.value
                    }else{
                        document.getElementById('reviewFromViewBtn').setAttribute('hidden','')
                    }
                    for(const p of document.querySelectorAll('[id$=View]:not([id*=date])')){
                        p.innerHTML = data[p.id.replace('View','')]
                    }
                    document.getElementById('commentsView').innerHTML = null;
                    document.getElementById('gradeView').innerHTML = null;
                    document.getElementById('start_dateView').innerHTML = moment(data['start_dateView']).format('MMMM Do YYYY, hh:mm:ss') ;
                    document.getElementById('expiry_dateView').innerHTML = moment(data['expiry_dateView']).format('MMMM Do YYYY, hh:mm:ss') ;
                    document.getElementById('applicationViewModalLabel').innerHTML = `Application #${this.id.replace('ApplicationBtn','')}`;
                   
                    if(data['execution_certificate'] === null){
                        document.getElementById('execution_certificateLink').setAttribute('hidden','');
                    }else{
                        document.getElementById('execution_certificateLink').removeAttribute('hidden');
                        document.getElementById('execution_certificateLink').href = `/GetPdf?path=..\\${data['execution_certificate']}`;
                    }
                    if(data['completion_report'] === null){
                        document.getElementById('completion_reportLink').setAttribute('hidden','');
                    }else{
                        document.getElementById('completion_reportLink').removeAttribute('hidden');
                        document.getElementById('completion_reportLink').href = `/GetPdf?path=..\\${data['completion_reportLink']}`;
                    }
                    if(data['progress_report'] ===  null){
                       
                        document.getElementById('progress_reportLink').setAttribute('hidden','');
                    }else{
                        
                        document.getElementById('progress_reportLink').removeAttribute('hidden');
                        document.getElementById('progress_reportLink').href = `/GetPdf?path=..\\${data['progress_reportLink']}`;
                    }
                    new bootstrap.Modal(document.getElementById('applicationViewModal')).show();
                },
            })
        })
    }

    for (i = 0; i < rejectBtns.length; i++) {

        rejectBtns[i].addEventListener('click', function () {
           
           
            $.ajax({
                method: 'GET',
                url: `/student/GetComment?review_id=${this.value}`,
                success: async (data) => {
                    console.dir(data);
                    if(data['approval'] === null){
                        document.getElementById('reviewFromViewBtn').removeAttribute('hidden');
                        
                    }else{
                        document.getElementById('reviewFromViewBtn').setAttribute('hidden','');
                    }
                    for(const p of document.querySelectorAll('[id$=View]:not([id*=date])')){
                        p.innerHTML = data[p.id.replace('View','')]
                    }
                    document.getElementById('commentsView').innerHTML = data['comments'];
                    document.getElementById('gradeView').innerHTML = data['grade'];
                    
                    
                    new bootstrap.Modal(document.getElementById('applicationRejectViewModal')).show();
                },
            })
        })

    }
}




initTableButtons();