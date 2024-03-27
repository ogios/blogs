#!/bin/bash

bun run create.ts

# map=()
# shopt -s nullglob
#
# # 遍历当前目录下的文件
# for f in *.md; do
# 	if [[ -f "$f" ]]; then
# 		# 提取文件名中的数字部分
# 		if [[ "$f" =~ ^([0-9]+)\.md ]]; then
# 			number=${BASH_REMATCH[1]}
# 			# 检查数字是否以0开头
# 			if [[ "$number" != 0* || "$number" == "0" ]]; then
# 				echo "$f"
# 				map+=("$number")
# 			fi
# 		fi
# 	fi
# done
#
# # 将数组中的元素转为整数
# for i in "${!map[@]}"; do
# 	map[$i]=$((10#${map[$i]}))
# done
#
# # 找到最大值
# max_value=0
# for num in "${map[@]}"; do
# 	if ((num > max_value)); then
# 		max_value=$num
# 	fi
# done
#
# echo "Max value: $max_value"
#
# touch "$((max_value + 1)).md"
