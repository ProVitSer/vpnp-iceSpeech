window.onload = function() {
    const form = document.querySelector("form");
    form.addEventListener('submit', handleFormSubmit);


    function serializeForm(formNode) {
        const { elements } = formNode;
        const requset = {};
        const data = Array.from(elements)
            .filter((item) => !!item.name)
            .map((element) => {
                const { name, value } = element;
                requset[name] = value;
                return { name, value };
            });
        return getVoice(requset);
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        serializeForm(form);
    }

    function getVoice(data) {
        const { fileName, text, voice } = data;
        if (text.length > 5000) return swal("Ошибка!", `Слишком большой текст, ограничение 5000 символов`, "error");
        const request = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fileName,
                text,
                voice: formatVoice(voice),
            })
        };
        swal("Отличная работа!", "Все отправленно в TTS, скоро начнется загрузка", "success");
        fetch(`http://${host}/yandex-speech/tts`, request)
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
                anchor.download = `${fileName}.mp3`;
                anchor.click();
                window.URL.revokeObjectURL(url);
                swal("Все сделано!", "Все преобразовано, скачка началась", "success");
                // document.querySelector("form").reset();
            })
            .catch(async(e) => {
                swal("Ошибка!", `Есть проблемы с обработкой данных на сервере: ${e} `, "error");

            })
    }

    function formatVoice(voiceName) {
        switch (voiceName) {
            case 'Алена':
                return 'alena';
            case 'Филип':
                return 'filipp';
            case 'Джейн':
                return 'jane';
            case 'Омаж':
                return 'omazh';
            case 'Захар':
                return 'zahar';
            case 'Ермил':
                return 'ermil';
            default:
                return 'alena';
        }
    }
}