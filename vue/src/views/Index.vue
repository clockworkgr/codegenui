<template>
	<div>
		<div class="container">
			<SpLatestBlocks />
			<!-- this line is used by starport scaffolding # 4 -->
			<SpType modulePath="clockworkgr/codegenui/clockworkgr.codegenui.blog" moduleType="Post" />
		</div>
	</div>
</template>

<style scoped>
.container {
	max-width: 800px;
	margin: 2rem auto;
	padding: 1rem;
}
</style>
<script>
export default {
	name: 'Index'
}
</script>
