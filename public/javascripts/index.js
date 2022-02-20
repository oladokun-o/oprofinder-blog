(function() {
    const truncateString = (string = '', maxLength = 50) => 
    string.length > maxLength 
        ? `${string.substring(0, maxLength)}…`
        : string

    var titles = [];
    titles.push($('.txt-truncate-card-title'))
    $('.txt-truncate').html(truncateString($('.txt-truncate').text(), 200))
    $('.txt-truncate-card').html(truncateString($('.txt-truncate-card').text(), 50))
})()

//html editor
tinymce.init({
    selector: '#postTextarea',
    plugins: 'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
    menubar: 'file edit view insert format tools table help',
    toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
    toolbar_sticky: true,
    autosave_ask_before_unload: true,
    autosave_interval: "30s",
    autosave_prefix: "{path}{query}-{id}-",
    autosave_restore_when_empty: false,
    autosave_retention: "2m",
    image_advtab: true,
    /*content_css: '//www.tiny.cloud/css/codepen.min.css',*/
    link_list: [
        { title: 'My page 1', value: 'https://www.codexworld.com' },
        { title: 'My page 2', value: 'https://www.xwebtools.com' }
    ],
    image_list: [
        { title: 'My page 1', value: 'https://www.codexworld.com' },
        { title: 'My page 2', value: 'https://www.xwebtools.com' }
    ],
    image_class_list: [
        { title: 'None', value: '' },
        { title: 'Some class', value: 'class-name' }
    ],
    importcss_append: true,
    file_picker_callback: function (callback, value, meta) {
        /* Provide file and text for the link dialog */
        if (meta.filetype === 'file') {
            callback('https://www.google.com/logos/google.jpg', { text: 'My text' });
        }
    
        /* Provide image and alt text for the image dialog */
        if (meta.filetype === 'image') {
            callback('https://www.google.com/logos/google.jpg', { alt: 'My alt text' });
        }
    
        /* Provide alternative source and posted for the media dialog */
        if (meta.filetype === 'media') {
            callback('movie.mp4', { source2: 'alt.ogg', poster: 'https://www.google.com/logos/google.jpg' });
        }
    },
    templates: [
        { title: 'New Table', description: 'creates a new table', content: '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>' },
        { title: 'Starting my story', description: 'A cure for writers block', content: 'Once upon a time...' },
        { title: 'New list with dates', description: 'New List with dates', content: '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>' }
    ],
    template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
    template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
    height: 600,
    image_caption: true,
    quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
    noneditable_noneditable_class: "mceNonEditable",
    toolbar_mode: 'sliding',
    contextmenu: "link image imagetools table",
});

//error box
var errorBox = $('#error');

$('.error-bg').on('click', () => {
    checkForError('close')
})
$('.close i').on('click', () => {
    checkForError('close')
})
function isEmpty( el ){
    return !$.trim(el.html())
}

function checkForError(stat) {
    if (isEmpty(errorBox)) {
        errorBox.fadeOut()
    } else if (stat == 'close') {
        errorBox.fadeOut()
        errorBox.find('main').remove()
        errorBox.find('.error-text').remove()
    } else {
        if (!stat) {
            errorBox.fadeIn('fast')
        } else {
            errorBox.fadeIn('fast')
            setTimeout(() => {
                errorBox.fadeOut('fast')
            }, 3000);
        }
    }
}
checkForError()

//date and time
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function formatDate(date) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    // Show date in "dd-mm-yyyy' format.
    var d = date.getDate(), m = months[date.getMonth()], y = date.getFullYear();
    var fullDate = m + ' ' + d + ', ' + y
    return fullDate
}

//post story 
$('#addPostForm').on('submit', function (e) {      
    this.classList.add('was-validated');
    e.preventDefault();
    var post = tinyMCE.get('postTextarea');
    var latest;
    if ($('#latest').val() == 'yes') latest = true
    else latest = false
    $.ajax({
        type: "POST",
        url: "/addpost",
        data: {
            tag: $('#tag').val(),
            title: $('#title').val(),
            post: post.getContent(),
            latest: latest,
            time: formatAMPM(new Date),
            date: formatDate(new Date),
            filename: $('#myfile').val().split('\\').pop()
        },
        success: function (response) {
            errorBox.append(response)                 
            uploadFile(response.id)
            checkForError()
        },
        error: function(response) {            
            if (response.responseJSON.pos !== undefined) {
                let target = document.getElementById(response.responseJSON.pos),
                textArea = document.querySelector('.tox');
                target.scrollIntoView({
                    behavior: 'auto',
                    block: 'center',
                    inline: 'center'
                })                                
                textArea.classList.add('invalid-tox');               
                setTimeout(() => {
                    textArea.classList.remove('invalid-tox');               
                }, 3000);                
                if (target.nodeName == 'INPUT') target.setCustomValidity('Invalid field.');                
            } else if (response.responseJSON.errmsg !== undefined) {
                errorBox.removeClass('d-none').append(response.responseJSON.errmsg)
            } else {
                errorBox.removeClass('d-none').append(response.responseText)
            }
            checkForError(false)
        }
    });
});

$('input[type=file]').removeAttr('required')

function uploadFile(id) {    
    var fd = new FormData();
        var files = $('#myfile')[0].files[0];
        fd.append('myfile',files);        
        fd.append('filename', $('#myfile').val().split('\\').pop());
        $('.stat').fadeIn('slow').html('<i class="fa fa-spin fa-spinner"></i>')
    setTimeout(() => {
        $.ajax({
            method: "POST",
            url: "/addpostimage/:"+id,
            enctype: "multipart/form-data",
            data: fd,
            processData: false,
            contentType: false,
            success: function (response) {
                $('.stat').html('<i class="fa fa-check text-success"></i>')                                
                $('.img-box').html(`<img src="/uploads/${response.newName}" />`)
            },
            error: function (response) {
                $('.stat').html('<i class="fa fa-times text-danger"></i>')
                $('#size').addClass('text-danger').html('File not uploaded please try again')
            }
        });
    }, 500);
}

function fileValidation1() {
    var fileInput = 
        document.getElementById('myfile');
      
    var filePath = fileInput.value;
  
    // Allowing file type
    var allowedExtensions = /(\.png|\.jpg|\.jpeg|\.pdf)$/i;
      
    if (!allowedExtensions.exec(filePath)) {
        $('#size').addClass('text-danger').html('Allowed only .png, .jpg, .jpeg and .pdf');
        //fileInput.value = '';
        return false;
    } else {
        $('#size').fadeOut()
    }
};

$('input').on('keyup', function() {
    this.setCustomValidity('');
})
