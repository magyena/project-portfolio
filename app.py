from flask import Flask, redirect, render_template, jsonify, request
import psycopg2
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
UPLOAD_FOLDER = "static/uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

hostname = "aws-0-ap-southeast-1.pooler.supabase.com"
database = "postgres"
port = "6543"
username = "postgres.wznglqsbzzejpfwhesmw"
password = "M@langPost11"


def get_db_connection():
    conn = psycopg2.connect(
        database=database, user=username, password=password, host=hostname, port=port
    )
    return conn


@app.route("/projects", methods=["GET"])
def get_projects():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM projects ORDER BY id DESC")
    rows = cur.fetchall()
    column_names = [desc[0] for desc in cur.description]
    result = [dict(zip(column_names, row)) for row in rows]
    cur.close()
    conn.close()
    return jsonify(result)


@app.route("/")
def index():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("SELECT * FROM projects ORDER BY id DESC")
    project_rows = cur.fetchall()
    project_cols = [desc[0] for desc in cur.description]

    projects = [dict(zip(project_cols, row)) for row in project_rows]

    cur.close()
    conn.close()

    return render_template("index.html", projects=projects)


@app.route("/detail")
def detail():
    return render_template("detail.html")


@app.route("/add", methods=["GET", "POST"])
def add():
    if request.method == "POST":
        title = request.form["title"]
        short_description = request.form["short_description"]
        full_description = request.form["full_description"]
        technologies = request.form["technologies"]
        github_link = request.form["github_link"]
        live_demo_link = request.form["live_demo_link"]
        is_featured = request.form.get("is_featured") == "on"

        # ✅ Tambahan baru
        progress = int(request.form.get("progress", 0))  # Default ke 0 kalau kosong
        jobdesk = request.form.get("jobdesk", "").strip()

        # Gambar utama
        file = request.files["image"]
        if file and file.filename != "":
            filename = secure_filename(file.filename)
            image_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            file.save(image_path)
        else:
            filename = "default.png"

        # Gambar detail aplikasi
        detail_file = request.files.get("detail_image")
        if detail_file and detail_file.filename != "":
            detail_filename = secure_filename(detail_file.filename)
            detail_image_path = os.path.join(
                app.config["UPLOAD_FOLDER"], detail_filename
            )
            detail_file.save(detail_image_path)
        else:
            detail_filename = None  # atau default jika ada

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO projects (
                title, image, detail_image, short_description, 
                full_description, technologies, github_link, 
                live_demo_link, is_featured, progress, jobdesk
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                title,
                filename,
                detail_filename,
                short_description,
                full_description,
                technologies,
                github_link,
                live_demo_link,
                is_featured,
                progress,
                jobdesk,
            ),
        )
        conn.commit()
        cur.close()
        conn.close()
        return redirect("/")
    return render_template("project.html")


# if __name__ == "__main__":
#     app.run(debug=False)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
