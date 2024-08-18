document.getElementById('uploadForm').onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('tabletImage', document.getElementById('tabletImage').files[0]);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            document.getElementById('result').innerHTML = `
                <h2>Tablet Information</h2>
                <p><strong>Name:</strong> ${result.name}</p>
                <p><strong>Use:</strong> ${result.use}</p>
                <p><strong>Side Effect:</strong> ${result.sideEffect}</p>
            `;
        } else {
            document.getElementById('result').innerText = 'Error: Unable to process the image';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('result').innerText = 'Error: Unable to process the image';
    }
};
