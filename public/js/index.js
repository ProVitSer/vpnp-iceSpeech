window.onload = function() {
    async function ttsTable() {
        const response = await fetch(`http://${host}/yandex-speech/files`);
        const result = await response.json();
        if (![201, 200].includes(response.status)) {
            console.log(result)
            alert(result.message)
        }

        let tables = '';

        result.data.map((file) => {
            tables += `
            <tr><td>${file.originFileName}</td><td>${file.date}</td><td><button class="badge badge-success" id=${file.originFileName}>Скачать</button>&nbsp&nbsp<button class="badge badge-danger" id=${file.originFileName}>Удалить</button></td></tr>
            `
        });
        let div = document.getElementById('tts-voice-table');
        div.innerHTML = tables;
        addEventListene(document);


    }
    setTimeout(ttsTable, 1000);

    function addEventListene(document) {
        const download = document.querySelectorAll(".badge-success");
        download.forEach((button) => {
            button.addEventListener('click', getVoice);
        });

        const del = document.querySelectorAll(".badge-danger");
        del.forEach((button) => {
            button.addEventListener('click', deleteVoiceFile);
        });
    }

    function deleteVoiceFile(e) {
        swal({
                title: "Вы точно уверены?",
                text: "После удаления вы не сможете восстановить этот файл!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    deleteFile(e)

                } else {
                    swal("Ваш файл сохранился!");
                }
            });
    }

    function deleteFile(e) {
        fetch(`http://${host}/yandex-speech/file`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ originFileName: e.target.id })
            })
            .then((result) => {
                return window.location.reload();
            });
    }

    function getVoice(e) {
        fetch(`http://${host}/yandex-speech/file`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ originFileName: e.target.id })
            })
            .then(async(result) => {
                if (![201, 200].includes(result.status)) {
                    const response = await result.json();
                    throw response.message;
                }
                return result.blob();
            })
            .then((data) => {
                var url = window.URL.createObjectURL(data),
                    anchor = document.createElement("a");
                anchor.href = url;
                anchor.download = `${e.target.id}.mp3`;
                anchor.click();
                window.URL.revokeObjectURL(url);
            })
            .catch((e) => {
                alert(result.status);

            })
    }

    function alert(message) {
        swal("Ошибка!", `Есть проблемы с обработкой данных на сервере: ${message}`, "error");
    }
}