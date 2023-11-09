$(document).ready(function() {
    function loadUserData(userId) {
        $.ajax({
            type: 'GET',
            url: `admin/user/${userId}`,
            success: function(user) {
                $('#editUserId').val(user._id);
                $('#editUserFIO').val(user.FIO);
                $('#editUserBirth').val(user.birth);
                $('#editUserEmail').val(user.mail);
                $('#editUserRole').val(user.role);
                $('#editUserStatus').val(user.status);
            },
            error: function() {
                alert('Произошла ошибка при получении данных пользователя.');
            }
        });
    }

    $('.close').on('click', function () {
        $('#editUserModal').modal('hide');
        location.reload();
    });

    $(document).on('show.bs.modal', '#editUserModal', function(event) {
        const userId = $(event.relatedTarget).attr('href').substring(1);
        loadUserData(userId);
    });

    $(document).on('submit', '#edit-user-form', function(event) {
        event.preventDefault();
        let formData = $(this).serialize();
        $.ajax({
            type: 'POST',
            url: '/admin/user/update',
            contentType: 'application/x-www-form-urlencoded',
            data: formData,
            success: function() {
                $('#editUserModal').modal('hide');
                location.reload();
            },
            error: function() {
                alert('Произошла ошибка при обновлении данных пользователя.');
            }
        });
    });
});