require "json"
require "yaml"
require "digest"
require "open3"
require "uri"
require "rexml/document"

ROOT = File.expand_path("..", __dir__)

def assert(condition, message)
  abort "FAIL: #{message}" unless condition
end

def identifiers(prefix, count)
  (1..count).map { |number| format("%s%02d", prefix, number) }
end

def load_json(relative)
  JSON.parse(File.read(File.join(ROOT, relative)))
end

def check_shell(source, label)
  output, result = Open3.capture2e("bash", "-n", stdin_data: source)
  assert(result.success?, "shell syntax #{label}: #{output}")
end

Dir[File.join(ROOT, "**/*.json")].each { |path| JSON.parse(File.read(path)) }
plan = load_json("content/roadmap/plan.json")
days = plan.fetch("days")
assert(days.map { |day| day.fetch("day") } == (1..30).to_a, "30 ordered days")
assert(days.map { |day| day.fetch("phase") }.uniq == (1..6).to_a, "six phases")
assert(plan.fetch("scheduleMinutes") == {"concepts" => 20, "lab" => 40, "interviewAndIncident" => 20, "revision" => 10}, "90-minute allocation")
assert(days.flat_map { |day| day.fetch("resume") }.uniq.sort == identifiers("R", 56), "resume coverage")
assert(days.flat_map { |day| day.fetch("claims") }.uniq.sort == identifiers("C", 24), "claim coverage")
assert(days.flat_map { |day| day.fetch("support") }.uniq.sort == identifiers("S", 10), "prerequisite coverage")
assert(File.file?(File.expand_path(plan.fetch("source"), File.join(ROOT, "content/roadmap"))), "audit source path")

questions = load_json("content/interview-questions/questions.json").fetch("questions")
question_ids = identifiers("Q", 100)
assert(questions.map { |question| question.fetch("id") } == question_ids, "100 unique ordered questions")
answer_text = File.read(File.join(ROOT, "content/interview-questions/answers.md"))
assert(answer_text.scan(/^## (Q\d+)$/).flatten == question_ids, "100 answer headings")
%w[Expected Model Avoid].each do |section|
  assert(answer_text.scan(/\*\*#{section}:\*\*/).length == 100, "answer field #{section}")
end
questions.each do |question|
  %w[question whyAsked followUps answer priority difficulty type resume].each do |field|
    assert(question.key?(field) && !question[field].empty?, "#{question['id']} #{field}")
  end
  assert((question.fetch("resume") - identifiers("R", 56)).empty?, "question resume IDs")
  assert(question.fetch("answer") == "answers.md##{question.fetch('id').downcase}", "answer link")
end

incidents = load_json("content/troubleshooting/incidents.json")
assert(incidents.map { |incident| incident.fetch("id") } == identifiers("I", 40), "40 incident IDs")
incidents.each do |incident|
  assert(incident.fetch("environment") == "simulation", "synthetic evidence label")
  assert(incident.fetch("possibleCauses").length >= 3, "competing causes")
  assert(incident.fetch("evidence").length >= 2, "evidence cards")
  incident.fetch("evidence").each do |card|
    %w[check command output].each { |field| assert(!card.fetch(field).empty?, "evidence #{field}") }
  end
  assert(!incident.key?("solution") && !incident.key?("rootCause"), "separate solutions")
end
{"hints" => "H", "solutions" => "S"}.each do |name, prefix|
  text = File.read(File.join(ROOT, "content/troubleshooting/#{name}.md"))
  assert(text.scan(/^## (#{prefix}\d{2})\b/).flatten == identifiers(prefix, 40), "40 #{name}")
end

days.each do |day|
  lesson = File.expand_path(day.fetch("lesson"), File.join(ROOT, "content/roadmap"))
  text = File.read(lesson)
  assert(text.start_with?("# Day #{day.fetch('day')}:"), "day title #{lesson}")
  assert(text.scan(/^## (\d+)\./).flatten.map(&:to_i) == (1..10).to_a, "ten sections #{lesson}")
  day.fetch("questions").each do |identifier|
    question = questions.find { |item| item.fetch("id") == identifier }
    assert(question && question.fetch("day") == day.fetch("day"), "daily question #{identifier}")
  end
  assert(incidents.any? { |incident| incident.fetch("id") == day.fetch("incident") }, "daily incident")
end
assert(Dir[File.join(ROOT, "content/**/day-*.md")].length == 30, "exactly 30 lesson files")
assert(Dir[File.join(ROOT, "content/projects/project-*.md")].length == 5, "five projects")
defense = File.read(File.join(ROOT, "content/resume-defense/defense.md"))
assert(defense.scan(/^\| (C\d{2}) /).flatten == identifiers("C", 24), "claim defense matrix")

markdown_files = Dir[File.join(ROOT, "**/*.md")]
shell_blocks = 0
markdown_files.each do |path|
  text = File.read(path)
  assert(text.scan(/^```/).length.even?, "balanced fences #{path}")
  text.scan(/\[[^\]]+\]\(([^)]+)\)/).flatten.each do |target|
    next if target.match?(/\A(?:https?:|mailto:|#)/)
    local = URI::DEFAULT_PARSER.unescape(target.split("#", 2).first)
    assert(File.exist?(File.expand_path(local, File.dirname(path))), "link #{path} -> #{target}")
  end
  text.scan(/^```(?:bash|sh)\s*\n(.*?)^```/m).flatten.each do |source|
    check_shell(source, path)
    shell_blocks += 1
  end
end
Dir[File.join(ROOT, "**/*.sh")].each { |path| check_shell(File.read(path), path) }

yaml_files = Dir[File.join(ROOT, "**/*.{yaml,yml}")].reject { |path| path.include?("/templates/") }
yaml_files.each do |path|
  documents = YAML.load_stream(File.read(path))
  assert(documents.all? { |document| document.is_a?(Hash) }, "YAML document #{path}")
  if path.include?("/github-actions/")
    workflow = documents.first
    assert(workflow.key?("on") || workflow.key?(true), "workflow trigger")
    workflow.fetch("jobs").each_value do |job|
      (job["steps"] || []).each do |step|
        check_shell(step["run"], path) if step.key?("run")
      end
    end
  end
end
REXML::Document.new(File.read(File.join(ROOT, "fixtures/java/pom.xml")))

originals = {
  "../roadmap.md" => "55bb603817296aada32fc6684abd3e57e4101415b897a08a83c59d08bf6fd6d0",
  "../../Manikanta_Kavulapalli_DevOps_Engineer_Resume.pdf" => "95c6c368bbbda8921137e3455382a002d20fe3d69ea05e2538f7e5b1c0445841"
}
originals.each do |relative, expected|
  path = File.expand_path(relative, ROOT)
  assert(File.file?(path) && Digest::SHA256.file(path).hexdigest == expected, "original preserved #{relative}")
end
unexpected = Dir[File.join(ROOT, "**/*"), File.join(ROOT, "**/.*")].select do |path|
  File.file?(path) && (File.basename(path).match?(/\A(?:\.env(?:\..*)?|terraform\.tfstate(?:\..*)?|kubeconfig|.*\.pem|.*\.key)\z/) || path.include?("/.terraform/"))
end
assert(unexpected.empty?, "unexpected secret/state artifacts #{unexpected.join(', ')}")
assert(!Dir.exist?(File.join(ROOT, ".github/workflows")), "CI examples remain inactive")
puts "PASS: 30 lessons, 56 resume entries, 24 claims, 10 prerequisite groups"
puts "PASS: 100 questions/answers, 40 incidents/hints/solutions, five projects"
puts "PASS: #{markdown_files.length} Markdown files/links, #{shell_blocks} shell blocks, #{yaml_files.length} YAML files, JSON and Maven XML"
puts "PASS: original resume/roadmap fingerprints and no unexpected state/key artifacts"
puts "Not covered: live infrastructure, hosted workflows, optional SDKs, Java build or learner performance."