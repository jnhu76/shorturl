<script>
	let longUrl = '';
	let shortUrl = '';
	let error = '';
	let loading = false;

	async function shortenUrl() {
		if (!longUrl) {
			error = '请输入URL';
			return;
		}

		loading = true;
		error = '';
		try {
			const response = await fetch('/api/shorten', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ url: longUrl })
			});

			if (!response.ok) {
				throw new Error('生成短链接失败');
			}

			const data = await response.json();
			shortUrl = data.shortUrl;
		} catch (e) {
			error = e.message;
		} finally {
			loading = false;
		}
	}

	function copyToClipboard() {
		navigator.clipboard
			.writeText(shortUrl)
			.then(() => {
				alert('已复制到剪贴板');
			})
			.catch(() => {
				alert('复制失败');
			});
	}
</script>

<div class="container">
	<h1>URL短链接生成器</h1>
	<p class="description">输入长URL，获取简短易记的链接</p>

	<div class="input-group">
		<input type="url" bind:value={longUrl} placeholder="请输入要缩短的URL" class="url-input" />
		<button on:click={shortenUrl} disabled={loading} class="shorten-btn">
			{loading ? '生成中...' : '生成短链接'}
		</button>
	</div>

	{#if error}
		<p class="error">{error}</p>
	{/if}

	{#if shortUrl}
		<div class="result">
			<p>您的短链接:</p>
			<div class="short-url-container">
				<span class="short-url">{shortUrl}</span>
				<button on:click={copyToClipboard} class="copy-btn">复制</button>
			</div>
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 800px;
		margin: 2rem auto;
		padding: 0 1rem;
	}

	h1 {
		color: #333;
		text-align: center;
		margin-bottom: 0.5rem;
	}

	.description {
		text-align: center;
		color: #666;
		margin-bottom: 2rem;
	}

	.input-group {
		display: flex;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.url-input {
		flex: 1;
		padding: 0.75rem;
		border: 2px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
	}

	.url-input:focus {
		outline: none;
		border-color: #0066cc;
	}

	.shorten-btn {
		padding: 0.75rem 1.5rem;
		background-color: #0066cc;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
	}

	.shorten-btn:disabled {
		background-color: #999;
		cursor: not-allowed;
	}

	.shorten-btn:hover:not(:disabled) {
		background-color: #0052a3;
	}

	.error {
		color: #dc3545;
		margin: 1rem 0;
	}

	.result {
		margin-top: 2rem;
		padding: 1rem;
		background-color: #f8f9fa;
		border-radius: 4px;
	}

	.short-url-container {
		display: flex;
		gap: 1rem;
		align-items: center;
		margin-top: 0.5rem;
	}

	.short-url {
		font-size: 1.1rem;
		color: #0066cc;
		word-break: break-all;
	}

	.copy-btn {
		padding: 0.5rem 1rem;
		background-color: #28a745;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	.copy-btn:hover {
		background-color: #218838;
	}
</style>
