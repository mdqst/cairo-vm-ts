TMP_PREFIX="cairo-vm-ts"

CAIRO_0_PATH=cairo_programs/cairo_0
CAIRO_0_FILES:=$(shell find $(CAIRO_0_PATH) -name '*.cairo')
VALID_CAIRO_0_FILES=$(shell find $(CAIRO_0_PATH) -name '*.cairo' -not -path "**/bad_programs/*")
COMPILED_CAIRO_0_FILES:=$(CAIRO_0_FILES:%.cairo=%.json)
VALID_COMPILED_CAIRO_0_FILES:=$(VALID_CAIRO_0_FILES:%.cairo=%.json)

compile: $(COMPILED_CAIRO_0_FILES)

%.json: %.cairo
	poetry run cairo-compile $< --output $@

run_all: $(VALID_COMPILED_CAIRO_0_FILES)
	@TMP_DIR=$(shell mktemp -d -t $(TMP_PREFIX)-XXXXXXXX); \
	echo "TMP_DIR: $$TMP_DIR"; \
	for file in $^; do \
		echo "Running $$file..."; \
		mem_file=$$TMP_DIR/$$(basename $$file .json).ts.memory; \
		trace_file=$$TMP_DIR/$$(basename $$file .json).ts.trace; \
		cairo run -s $$file --export-memory $$mem_file --export-trace $$trace_file; \
	done

diff_test: $(VALID_COMPILED_CAIRO_0_FILES)
	@TMP_DIR=$(shell mktemp -d -t $(TMP_PREFIX)-XXXXXXXX); \
	echo "TMP_DIR: $$TMP_DIR"; \
	for file in $^; do \
		echo "Diff testing $$file..."; \
		ts_mem_file=$$TMP_DIR/$$(basename $$file .json).ts.memory; \
		ts_trace_file=$$TMP_DIR/$$(basename $$file .json).ts.trace; \
		py_mem_file=$$TMP_DIR/$$(basename $$file .json).py.memory; \
		py_trace_file=$$TMP_DIR/$$(basename $$file .json).py.trace; \
		rs_mem_file=$$TMP_DIR/$$(basename $$file .json).rs.memory; \
		rs_trace_file=$$TMP_DIR/$$(basename $$file .json).rs.trace; \
		cairo run -s $$file --offset 1 --export-memory $$ts_mem_file --export-trace $$ts_trace_file; \
		cairo-run --program=$$file --layout=starknet_with_keccak --memory_file $$py_mem_file --trace_file $$py_trace_file; \
		$(CAIRO_VM_BIN) $$file --layout=starknet_with_keccak --memory_file $$rs_mem_file --trace_file $$rs_trace_file; \
		cairo compare-memory $$ts_mem_file $$rs_mem_file $$py_mem_file; \
		if ! cmp -s $$rs_trace_file $$py_trace_file && rs_trace_file; then \
			echo "Traces are different"; \
		fi; \
	done
