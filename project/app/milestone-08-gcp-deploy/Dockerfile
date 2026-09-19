# DEBUGGING CHALLENGE — see the milestone doc. This hardcodes port 8000
# instead of reading Cloud Run's injected $PORT. Deployed as-is, the
# revision will fail its startup health check. Reason about why before
# fixing the CMD line.
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
