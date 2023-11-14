

const myTinymce = function (textarea) {
    return {
        selector: textarea,
        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Author name',
        mergetags_list: [
            { value: 'First.Name', title: 'First Name' },
            { value: 'Comment', title: 'Comment' },
        ]
    }
}

tinymce.init(myTinymce('textarea#commentInput'));

document.getElementById('reviewSubmitBtn').addEventListener('click', function () {
    const commentInput = tinymce.get("commentInput").getContent()
    hideErrors()
    $.ajax({
        method: 'POST',
        url: '/supervisor/ReviewApplication',
        data: JSON.stringify({
            'application_id': this.value,
            'grade': document.getElementById('gradeInput').value,
            'comment': commentInput.substring(3, commentInput.length - 4),
            'approval': document.getElementById('approvalInput').checked
        }),
        dataType: 'json',
        contentType: "application/json",
        success: async () => {
            table.clear()
            table.rows.add(await getAbbreviatedApplications())
            table.draw()
            initTableButtons()
            $('#applicationReviewModal').modal('hide')
        },
        error: (err) => {
            if (err.status === 400 && err.responseJSON?.errors !== undefined) 
                parseAndDisplayErrors(err.responseJSON.errors, ['comment','grade'])
            else
                console.error('Ajax Error:', err)
        }
    })
})

let deleteBTNs = document.querySelectorAll('#deleteBTN')
deleteBTNs.forEach(element => {
    element.addEventListener('click', function(e){
       
        e.preventDefault();;
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.isConfirmed) {
                const listItem = this.closest("li"); 
                const studentIdInput = listItem.querySelector('input[name="student_id"]');
                 const applicationIdInput = listItem.querySelector('input[name="application_id"]');
                 const studentId = studentIdInput.value; 
                 const applicationId = applicationIdInput.value; 


                $.ajax({
                    type: "POST",
                    url: '/student/deleteApplicacion',
                    data: JSON.stringify({'student_id':studentId,'application_id':applicationId}),
                    dataType: 'HTML',
                    contentType: "application/json",
                    success: function(){
                    console.log("success");
                    window.location.reload();
                    },
                    error: function(error){
                        console.log(error)
                    }
                    });


            }
        })
    })
});



let deleteReviewBTNs = document.querySelectorAll('#deleteReviewBTN')
deleteReviewBTNs.forEach(element => {
    element.addEventListener('click', function(e){
       
        e.preventDefault();;
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.isConfirmed) {
                const listItem = this.closest("li"); 
                const studentIdInput = listItem.querySelector('input[name="student_id_review"]');
                 const reviewIdInput = listItem.querySelector('input[name="review_id"]');
                 const applicationIdInput = listItem.querySelector('input[name="application_id_review"]');
                 const studentId = studentIdInput.value; 
                 const reviewId = reviewIdInput.value; 
                 const application = applicationIdInput.value;
                 console.log("studentId", studentId);
                 console.log("reviewId", reviewId);
                 console.log("application", application);


                $.ajax({
                    type: "POST",
                    url: '/student/deleteReview',
                    data: JSON.stringify({'student_id':studentId,'review_id':reviewId, 'application_id':application }),
                    dataType: 'HTML',
                    contentType: "application/json",
                    success: function(){
                    console.log("success");
                    window.location.reload();
                    },
                    error: function(error){
                        console.log(error)
                    }
                    });


            }
        })
    })
});

