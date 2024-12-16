<script setup>
import {
	reactive,
	computed,
	ref,
	watch,
	onMounted,
	onBeforeUnmount,
	onActivated,
	unref,
} from 'vue';
import * as echarts from 'echarts';
import { debounce } from 'lodash';
const data = reactive({
	seriesIndex: 0,
	dataIndex: 0,
});

const props = defineProps({
	options: {
		type: Object,
		required: true,
	},
	jsonData: {},
	width: '100%',
	height: {
		type: String,
		default: '600px',
	},
});
const emits = defineEmits(['mapClick', 'mapMouseover']);

const options = computed(() => {
	return Object.assign(props.options, {
		darkMode: 'auto',
	});
});

const elRef = ref();

let echartRef = null;

const contentEl = ref();

const styles = computed(() => {
	const width = props.width;
	const height = props.height;
	return {
		width,
		height,
	};
});
const dispatchAction = (seriesIndex, dataIndex) => {
	echartRef?.dispatchAction({
		type: 'downplay',
		seriesIndex: data.seriesIndex,
		dataIndex: data.dataIndex,
	});
	// nextTick(()=>{
	data.seriesIndex = seriesIndex;
	data.dataIndex = dataIndex;
	echartRef?.dispatchAction({
		type: 'highlight',
		seriesIndex,
		dataIndex,
	});
	echartRef?.dispatchAction({
		type: 'showTip',
		seriesIndex,
		dataIndex,
	});
	// })
};
const initChart = () => {
	if (unref(elRef) && props.options) {
		echartRef = echarts.init(unref(elRef));
		if (props.jsonData) {
			echarts.registerMap('china', props.jsonData);
		}
		echartRef.setOption(unref(props.options));
		echartRef.off('click');
		echartRef.on('click', (params) => {
			emits('mapClick', params);
		});
		echartRef.on('mouseover', (params) => {
			emits('mapMouseover', params);
		});
		echartRef.on('mouseout', (params) => {
			emits('mapMouseout', params);
		});
		echartRef.on('georoam', (params) => {
			let option = echartRef.getOption(); //获得option对象
			let len = option.geo.length;

			if (params.zoom != null) {
				//捕捉到缩放时
				for (var i = 0; i < len; i++) {
					option.geo[i].center = option.series[0].center;
					option.geo[i].zoom = option.series[0].zoom;
				}
				// console.log(option.series[1].center)
			} else {
				//捕捉到拖曳时

				for (var i = 0; i < len; i++) {
					option.geo[i].center = option.series[0].center;
				}
			}
			echartRef.setOption(option, true); //设置option
		});
	}
};
watch(
	() => options.value,
	(options) => {
		if (echartRef) {
			echartRef?.setOption(options);
		}
	},
	{
		deep: true,
	}
);

const resizeHandler = debounce(() => {
	if (echartRef) {
		echartRef.resize();
	}
}, 100);

const contentResizeHandler = async (e) => {
	if (e.propertyName === 'width') {
		resizeHandler();
	}
};
const registerMap = (mapName, mapData) => {
	echartRef.clear();
	echarts.registerMap(mapName, mapData);
	//  echartRef.setOption(state.options)
};

onMounted(() => {
	initChart();

	window.addEventListener('resize', resizeHandler);

	contentEl.value = document.getElementsByClassName(`v-layout-content`)[0];
	unref(contentEl) &&
		unref(contentEl).addEventListener(
			'transitionend',
			contentResizeHandler
		);
});

onBeforeUnmount(() => {
	window.removeEventListener('resize', resizeHandler);
	unref(contentEl) &&
		unref(contentEl).removeEventListener(
			'transitionend',
			contentResizeHandler
		);
});

onActivated(() => {
	if (echartRef) {
		echartRef.resize();
	}
});
defineExpose({
	dispatchAction,
	registerMap,
});
</script>

<template>
	<div ref="elRef" class="v-echart" :style="styles"></div>
</template>