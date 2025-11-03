job=$1
if [ -z "$job" ]; then
  echo "Usage: sh runner.sh <job_name>"
  exit 1
fi

echo "Running GitLab CI job: $job ..."
gitlab-runner exec docker "$job"
